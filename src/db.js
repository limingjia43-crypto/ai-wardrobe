const DB_NAME = "digital-wardrobe-v1";
const DB_VERSION = 1;

const seed = {
  categories: [
    { category_id: "cat-tops", user_id: "local-user", name: "上装", sort_order: 0, created_at: "2026-09-20T08:00:00.000Z", updated_at: "2026-09-20T08:00:00.000Z" },
    { category_id: "cat-bottoms", user_id: "local-user", name: "下装", sort_order: 1, created_at: "2026-09-20T08:00:00.000Z", updated_at: "2026-09-20T08:00:00.000Z" },
    { category_id: "cat-shoes", user_id: "local-user", name: "鞋子", sort_order: 2, created_at: "2026-09-20T08:00:00.000Z", updated_at: "2026-09-20T08:00:00.000Z" },
    { category_id: "cat-bags", user_id: "local-user", name: "包包", sort_order: 3, created_at: "2026-09-20T08:00:00.000Z", updated_at: "2026-09-20T08:00:00.000Z" },
  ],
  locations: [
    { location_id: "loc-bedroom", user_id: "local-user", name: "主卧衣柜 · 顶柜", sort_order: 0, is_active: true, created_at: "2026-09-20T08:00:00.000Z", updated_at: "2026-09-20T08:00:00.000Z" },
    { location_id: "loc-bed", user_id: "local-user", name: "床下 1 号收纳箱", sort_order: 1, is_active: true, created_at: "2026-09-20T08:00:00.000Z", updated_at: "2026-09-20T08:00:00.000Z" },
    { location_id: "loc-entry", user_id: "local-user", name: "玄关鞋柜", sort_order: 2, is_active: true, created_at: "2026-09-20T08:00:00.000Z", updated_at: "2026-09-20T08:00:00.000Z" },
  ],
  items: [
    { item_id: "item-cardigan", user_id: "local-user", image_url: "/assets/items/ivory-cardigan.png", name: "米白针织开衫", ai_suggested_name: "米白针织开衫", ai_suggested_category_id: "cat-tops", category_id: "cat-tops", storage_location_id: "loc-bedroom", storage_location_snapshot: "主卧衣柜 · 顶柜", location_status: "RECORDED", ai_status: "RECOGNIZED", location_updated_at: "2026-09-24T10:00:00.000Z", location_confirmed_at: "2026-09-26T10:00:00.000Z", created_at: "2026-09-24T10:00:00.000Z", updated_at: "2026-09-26T10:00:00.000Z" },
    { item_id: "item-trousers", user_id: "local-user", image_url: "/assets/items/charcoal-trousers.png", name: "深灰阔腿裤", ai_suggested_name: "灰色西装裤", ai_suggested_category_id: "cat-bottoms", category_id: "cat-bottoms", storage_location_id: "loc-bedroom", storage_location_snapshot: "主卧衣柜 · 顶柜", location_status: "RECORDED", ai_status: "CORRECTED", location_updated_at: "2026-09-23T09:00:00.000Z", location_confirmed_at: null, created_at: "2026-09-23T09:00:00.000Z", updated_at: "2026-09-23T09:00:00.000Z" },
    { item_id: "item-sneakers", user_id: "local-user", image_url: "/assets/items/ivory-sneakers.png", name: "奶油白休闲鞋", ai_suggested_name: "白色运动鞋", ai_suggested_category_id: "cat-shoes", category_id: "cat-shoes", storage_location_id: "loc-entry", storage_location_snapshot: "玄关鞋柜", location_status: "UNCERTAIN", ai_status: "CORRECTED", location_updated_at: "2026-09-22T08:00:00.000Z", location_confirmed_at: null, created_at: "2026-09-22T08:00:00.000Z", updated_at: "2026-09-27T08:00:00.000Z" },
    { item_id: "item-bag", user_id: "local-user", image_url: "/assets/items/brown-shoulder-bag.png", name: "棕色单肩包", ai_suggested_name: "棕色单肩包", ai_suggested_category_id: "cat-bags", category_id: "cat-bags", storage_location_id: null, storage_location_snapshot: null, location_status: "UNSET", ai_status: "RECOGNIZED", location_updated_at: null, location_confirmed_at: null, created_at: "2026-09-21T08:00:00.000Z", updated_at: "2026-09-21T08:00:00.000Z" },
    { item_id: "item-jacket", user_id: "local-user", image_url: "/assets/items/sage-jacket.png", name: "鼠尾草绿轻薄外套", ai_suggested_name: "绿色夹克", ai_suggested_category_id: "cat-tops", category_id: null, storage_location_id: "loc-bed", storage_location_snapshot: "床下 1 号收纳箱", location_status: "RECORDED", ai_status: "CORRECTED", location_updated_at: "2026-09-28T12:00:00.000Z", location_confirmed_at: null, created_at: "2026-09-28T12:00:00.000Z", updated_at: "2026-09-28T12:00:00.000Z" },
    { item_id: "item-tote", user_id: "local-user", image_url: "/assets/items/navy-tote.png", name: "藏蓝帆布托特包", ai_suggested_name: null, ai_suggested_category_id: null, category_id: null, storage_location_id: null, storage_location_snapshot: null, location_status: "UNSET", ai_status: "FAILED", location_updated_at: null, location_confirmed_at: null, created_at: "2026-09-29T13:30:00.000Z", updated_at: "2026-09-29T13:30:00.000Z" },
  ],
};

const requestToPromise = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

export async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("items")) db.createObjectStore("items", { keyPath: "item_id" });
      if (!db.objectStoreNames.contains("categories")) db.createObjectStore("categories", { keyPath: "category_id" });
      if (!db.objectStoreNames.contains("locations")) db.createObjectStore("locations", { keyPath: "location_id" });
      if (!db.objectStoreNames.contains("assets")) db.createObjectStore("assets", { keyPath: "asset_id" });
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta", { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function initializeDatabase(db) {
  const meta = await requestToPromise(db.transaction("meta").objectStore("meta").get("seeded"));
  if (meta) return;
  const tx = db.transaction(["categories", "locations", "items", "meta"], "readwrite");
  seed.categories.forEach((entry) => tx.objectStore("categories").put(entry));
  seed.locations.forEach((entry) => tx.objectStore("locations").put(entry));
  seed.items.forEach((entry) => tx.objectStore("items").put(entry));
  tx.objectStore("meta").put({ key: "seeded", value: true });
  await new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); });
}

export async function getAll(db, storeName) {
  return requestToPromise(db.transaction(storeName).objectStore(storeName).getAll());
}

export async function getOne(db, storeName, key) {
  return requestToPromise(db.transaction(storeName).objectStore(storeName).get(key));
}

export async function putOne(db, storeName, value) {
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).put(value);
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteOne(db, storeName, key) {
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).delete(key);
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteCategoryAndUnclassify(db, categoryId, items) {
  const tx = db.transaction(["categories", "items"], "readwrite");
  tx.objectStore("categories").delete(categoryId);
  items.filter((item) => item.category_id === categoryId).forEach((item) => {
    tx.objectStore("items").put({ ...item, category_id: null, updated_at: new Date().toISOString() });
  });
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

export async function renameLocationAndSnapshots(db, location, items) {
  const tx = db.transaction(["locations", "items"], "readwrite");
  tx.objectStore("locations").put(location);
  items.filter((item) => item.storage_location_id === location.location_id).forEach((item) => {
    tx.objectStore("items").put({ ...item, storage_location_snapshot: location.name, updated_at: location.updated_at });
  });
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
