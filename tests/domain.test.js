import { describe, expect, it } from "vitest";
import {
  classificationStatus,
  confirmLocation,
  deactivateLocation,
  markLocationUncertainState,
  moveItem,
  recordLocation,
  removeCategory,
  renameLocationRecords,
  searchByName,
} from "../src/domain.js";

const baseItem = {
  item_id: "item-1", name: "黑色羽绒服", category_id: null,
  storage_location_id: null, storage_location_snapshot: null,
  location_status: "UNSET", location_updated_at: null,
  location_confirmed_at: null, created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};
const timestamp = "2026-02-01T00:00:00.000Z";

describe("classification state", () => {
  it("derives UNCLASSIFIED only from a null category", () => {
    expect(classificationStatus(baseItem)).toBe("UNCLASSIFIED");
    expect(classificationStatus({ ...baseItem, category_id: "tops" })).toBe("CLASSIFIED");
  });

  it("moves an item between inbox and category without changing created_at", () => {
    const classified = moveItem(baseItem, "tops", timestamp);
    expect(classified.category_id).toBe("tops");
    expect(classified.created_at).toBe(baseItem.created_at);
    expect(moveItem(classified, null, timestamp).category_id).toBeNull();
  });

  it("deleting a category returns its items to inbox but keeps other items", () => {
    const categories = [{ category_id: "tops" }, { category_id: "bags" }];
    const items = [{ ...baseItem, category_id: "tops" }, { ...baseItem, item_id: "item-2", category_id: "bags" }];
    const result = removeCategory(categories, items, "tops", timestamp);
    expect(result.categories).toEqual([{ category_id: "bags" }]);
    expect(result.items[0].category_id).toBeNull();
    expect(result.items[0].created_at).toBe(baseItem.created_at);
    expect(result.items[1].category_id).toBe("bags");
  });
});

describe("search", () => {
  it("searches every item by name, including inbox items, with exact matches first", () => {
    const items = [
      { ...baseItem, item_id: "inbox", name: "羽绒服", category_id: null, updated_at: "2026-01-01" },
      { ...baseItem, item_id: "classified", name: "黑色羽绒服", category_id: "tops", updated_at: "2026-02-01" },
      { ...baseItem, item_id: "ignored", name: "棕色单肩包", category_id: "bags" },
    ];
    expect(searchByName(items, "羽绒服").map((item) => item.item_id)).toEqual(["inbox", "classified"]);
    expect(searchByName(items, "主卧")).toEqual([]);
  });
});

describe("location state", () => {
  const location = { location_id: "loc-1", name: "主卧衣柜 · 顶柜", is_active: true };

  it("records, confirms, and marks a location uncertain without losing the snapshot", () => {
    const recorded = recordLocation(baseItem, location, timestamp);
    expect(recorded.location_status).toBe("RECORDED");
    const confirmed = confirmLocation(recorded, "2026-02-02T00:00:00.000Z");
    expect(confirmed.location_updated_at).toBe(timestamp);
    expect(confirmed.location_confirmed_at).toBe("2026-02-02T00:00:00.000Z");
    expect(confirmed.updated_at).toBe(recorded.updated_at);
    expect(confirmed.storage_location_snapshot).toBe(recorded.storage_location_snapshot);
    const uncertain = markLocationUncertainState(confirmed, "2026-02-03T00:00:00.000Z");
    expect(uncertain.location_status).toBe("UNCERTAIN");
    expect(uncertain.storage_location_snapshot).toBe(location.name);
  });

  it("renames linked snapshots and deactivates a shortcut without clearing item history", () => {
    const recorded = recordLocation(baseItem, location, timestamp);
    const renamed = renameLocationRecords([recorded], location.location_id, "主卧衣柜 · 中层", timestamp)[0];
    expect(renamed.storage_location_snapshot).toBe("主卧衣柜 · 中层");
    expect(deactivateLocation(location, timestamp).is_active).toBe(false);
    expect(renamed.storage_location_snapshot).not.toBeNull();
  });
});
