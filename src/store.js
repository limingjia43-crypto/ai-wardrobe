import {
  deleteCategoryAndUnclassify,
  deleteOne,
  getAll,
  getOne,
  initializeDatabase,
  openDatabase,
  putOne,
  renameLocationAndSnapshots,
} from "./db.js";
import {
  classificationStatus,
  confirmLocation,
  deactivateLocation,
  markLocationUncertainState,
  moveItem,
  recordLocation,
  searchByName,
} from "./domain.js";

const state = {
  db: null,
  items: [],
  categories: [],
  locations: [],
  imageUrls: new Map(),
};

const now = () => new Date().toISOString();
const id = (prefix) => `${prefix}-${crypto.randomUUID()}`;

function sortState() {
  state.categories.sort((a, b) => a.sort_order - b.sort_order);
  state.locations.sort((a, b) => a.sort_order - b.sort_order);
  state.items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function hydrateImages() {
  for (const url of state.imageUrls.values()) URL.revokeObjectURL(url);
  state.imageUrls.clear();
  const localItems = state.items.filter((item) => item.image_url.startsWith("idb://asset/"));
  await Promise.all(localItems.map(async (item) => {
    const assetId = item.image_url.replace("idb://asset/", "");
    const asset = await getOne(state.db, "assets", assetId);
    if (asset?.blob) state.imageUrls.set(item.item_id, URL.createObjectURL(asset.blob));
  }));
}

export async function initializeStore() {
  state.db = await openDatabase();
  await initializeDatabase(state.db);
  await reload();
  return state;
}

export async function reload() {
  [state.items, state.categories, state.locations] = await Promise.all([
    getAll(state.db, "items"),
    getAll(state.db, "categories"),
    getAll(state.db, "locations"),
  ]);
  sortState();
  await hydrateImages();
}

export function getState() {
  return state;
}

export function itemImage(item) {
  return state.imageUrls.get(item.item_id) || item.image_url;
}

async function createLocationIfNeeded(locationId, customName) {
  const cleanName = customName?.trim();
  if (cleanName) {
    const existing = state.locations.find((entry) => entry.name === cleanName);
    if (existing) {
      if (!existing.is_active) await putOne(state.db, "locations", { ...existing, is_active: true, updated_at: now() });
      return existing.location_id;
    }
    const location = {
      location_id: id("loc"), user_id: "local-user", name: cleanName,
      sort_order: state.locations.filter((entry) => entry.is_active).length,
      is_active: true, created_at: now(), updated_at: now(),
    };
    await putOne(state.db, "locations", location);
    return location.location_id;
  }
  return locationId || null;
}

export async function createItem({ file, name, locationId, customLocation, aiStatus, suggestedName, suggestedCategoryId }) {
  const itemId = id("item");
  const assetId = id("asset");
  await putOne(state.db, "assets", { asset_id: assetId, blob: file, type: file.type, created_at: now() });
  const resolvedLocationId = await createLocationIfNeeded(locationId, customLocation);
  await reload();
  const location = state.locations.find((entry) => entry.location_id === resolvedLocationId);
  const timestamp = now();
  const item = {
    item_id: itemId,
    user_id: "local-user",
    image_url: `idb://asset/${assetId}`,
    name: name.trim(),
    ai_suggested_name: suggestedName || null,
    ai_suggested_category_id: suggestedCategoryId || null,
    category_id: null,
    storage_location_id: location?.location_id || null,
    storage_location_snapshot: location?.name || null,
    location_status: location ? "RECORDED" : "UNSET",
    ai_status: aiStatus,
    location_updated_at: location ? timestamp : null,
    location_confirmed_at: null,
    created_at: timestamp,
    updated_at: timestamp,
  };
  await putOne(state.db, "items", item);
  await reload();
  return item;
}

export async function updateItem(itemId, { file, name, locationId, customLocation }) {
  const item = state.items.find((entry) => entry.item_id === itemId);
  if (!item) throw new Error("物品不存在");
  let imageUrl = item.image_url;
  if (file) {
    if (imageUrl.startsWith("idb://asset/")) await deleteOne(state.db, "assets", imageUrl.replace("idb://asset/", ""));
    const assetId = id("asset");
    await putOne(state.db, "assets", { asset_id: assetId, blob: file, type: file.type, created_at: now() });
    imageUrl = `idb://asset/${assetId}`;
  }
  const resolvedLocationId = await createLocationIfNeeded(locationId, customLocation);
  await reload();
  const location = state.locations.find((entry) => entry.location_id === resolvedLocationId);
  const timestamp = now();
  await putOne(state.db, "items", {
    ...item,
    image_url: imageUrl,
    name: name.trim(),
    storage_location_id: location?.location_id || null,
    storage_location_snapshot: location?.name || null,
    location_status: location ? "RECORDED" : "UNSET",
    location_updated_at: location ? timestamp : null,
    updated_at: timestamp,
  });
  await reload();
}

export async function deleteItem(itemId) {
  const item = state.items.find((entry) => entry.item_id === itemId);
  if (item?.image_url.startsWith("idb://asset/")) await deleteOne(state.db, "assets", item.image_url.replace("idb://asset/", ""));
  await deleteOne(state.db, "items", itemId);
  await reload();
}

export async function assignCategory(itemId, categoryId) {
  const item = state.items.find((entry) => entry.item_id === itemId);
  if (!item) throw new Error("物品不存在");
  const previousCategoryId = item.category_id;
  await putOne(state.db, "items", moveItem(item, categoryId, now()));
  await reload();
  return previousCategoryId;
}

export async function setItemLocation(itemId, locationId, customName = "") {
  const item = state.items.find((entry) => entry.item_id === itemId);
  const resolvedLocationId = await createLocationIfNeeded(locationId, customName);
  await reload();
  const location = state.locations.find((entry) => entry.location_id === resolvedLocationId);
  const timestamp = now();
  await putOne(state.db, "items", recordLocation(item, location, timestamp));
  await reload();
}

export async function confirmItemLocation(itemId) {
  const item = state.items.find((entry) => entry.item_id === itemId);
  if (!item) return;
  const timestamp = now();
  await putOne(state.db, "items", confirmLocation(item, timestamp));
  await reload();
}

export async function markLocationUncertain(itemId) {
  const item = state.items.find((entry) => entry.item_id === itemId);
  if (!item) return;
  await putOne(state.db, "items", markLocationUncertainState(item, now()));
  await reload();
}

export async function addCategory(name) {
  const cleanName = name.trim();
  if (!cleanName) throw new Error("请输入分类名称");
  if (state.categories.some((entry) => entry.name === cleanName)) throw new Error("该分类已存在");
  const timestamp = now();
  await putOne(state.db, "categories", { category_id: id("cat"), user_id: "local-user", name: cleanName, sort_order: state.categories.length, created_at: timestamp, updated_at: timestamp });
  await reload();
}

export async function renameCategory(categoryId, name) {
  const cleanName = name.trim();
  const category = state.categories.find((entry) => entry.category_id === categoryId);
  if (!cleanName) throw new Error("请输入分类名称");
  if (state.categories.some((entry) => entry.category_id !== categoryId && entry.name === cleanName)) throw new Error("该分类已存在");
  await putOne(state.db, "categories", { ...category, name: cleanName, updated_at: now() });
  await reload();
}

export async function deleteCategory(categoryId) {
  await deleteCategoryAndUnclassify(state.db, categoryId, state.items);
  await reload();
  await reorderCategories(state.categories.map((entry) => entry.category_id));
}

export async function reorderCategories(ids) {
  await Promise.all(ids.map((categoryId, index) => {
    const category = state.categories.find((entry) => entry.category_id === categoryId);
    return putOne(state.db, "categories", { ...category, sort_order: index, updated_at: now() });
  }));
  await reload();
}

export async function addLocation(name) {
  const cleanName = name.trim();
  if (!cleanName) throw new Error("请输入位置名称");
  if (state.locations.some((entry) => entry.is_active && entry.name === cleanName)) throw new Error("该位置已存在");
  await createLocationIfNeeded(null, cleanName);
  await reload();
}

export async function renameLocation(locationId, name) {
  const cleanName = name.trim();
  const location = state.locations.find((entry) => entry.location_id === locationId);
  if (!cleanName) throw new Error("请输入位置名称");
  if (state.locations.some((entry) => entry.location_id !== locationId && entry.is_active && entry.name === cleanName)) throw new Error("该位置已存在");
  const updated = { ...location, name: cleanName, updated_at: now() };
  await renameLocationAndSnapshots(state.db, updated, state.items);
  await reload();
}

export async function removeLocation(locationId) {
  const location = state.locations.find((entry) => entry.location_id === locationId);
  await putOne(state.db, "locations", deactivateLocation(location, now()));
  await reload();
}

export async function reorderLocations(ids) {
  await Promise.all(ids.map((locationId, index) => {
    const location = state.locations.find((entry) => entry.location_id === locationId);
    return putOne(state.db, "locations", { ...location, sort_order: index, updated_at: now() });
  }));
  await reload();
}

export function searchItems(query) {
  return searchByName(state.items, query);
}

export function deriveClassificationStatus(item) {
  return classificationStatus(item);
}
