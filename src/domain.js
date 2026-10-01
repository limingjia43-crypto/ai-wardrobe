export const classificationStatus = (item) => item.category_id === null ? "UNCLASSIFIED" : "CLASSIFIED";

export function moveItem(item, categoryId, timestamp) {
  return { ...item, category_id: categoryId || null, updated_at: timestamp };
}

export function removeCategory(categories, items, categoryId, timestamp) {
  return {
    categories: categories.filter((category) => category.category_id !== categoryId),
    items: items.map((item) => item.category_id === categoryId ? moveItem(item, null, timestamp) : item),
  };
}

export function searchByName(items, query) {
  const normalized = query.trim().toLocaleLowerCase("zh-CN");
  if (!normalized) return [];
  return items.filter((item) => item.name.toLocaleLowerCase("zh-CN").includes(normalized)).sort((a, b) => {
    const aExact = a.name.toLocaleLowerCase("zh-CN") === normalized;
    const bExact = b.name.toLocaleLowerCase("zh-CN") === normalized;
    if (aExact !== bExact) return aExact ? -1 : 1;
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
}

export function recordLocation(item, location, timestamp) {
  return {
    ...item,
    storage_location_id: location?.location_id || null,
    storage_location_snapshot: location?.name || null,
    location_status: location ? "RECORDED" : "UNSET",
    location_updated_at: location ? timestamp : null,
    location_confirmed_at: null,
    updated_at: timestamp,
  };
}

export function confirmLocation(item, timestamp) {
  if (item.location_status === "UNSET") return item;
  return { ...item, location_confirmed_at: timestamp };
}

export function markLocationUncertainState(item, timestamp) {
  if (item.location_status === "UNSET") return item;
  return { ...item, location_status: "UNCERTAIN", updated_at: timestamp };
}

export function renameLocationRecords(items, locationId, nextName, timestamp) {
  return items.map((item) => item.storage_location_id === locationId
    ? { ...item, storage_location_snapshot: nextName, updated_at: timestamp }
    : item);
}

export function deactivateLocation(location, timestamp) {
  return { ...location, is_active: false, updated_at: timestamp };
}
