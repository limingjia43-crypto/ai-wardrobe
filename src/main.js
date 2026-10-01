import "./style.css";
import {
  addCategory,
  addLocation,
  assignCategory,
  confirmItemLocation,
  createItem,
  deleteCategory,
  deleteItem,
  getState,
  initializeStore,
  itemImage,
  markLocationUncertain,
  removeLocation,
  renameCategory,
  renameLocation,
  reorderCategories,
  reorderLocations,
  searchItems,
  setItemLocation,
  updateItem,
} from "./store.js";

const app = document.querySelector("#app");

function createEmptyDraft() {
  return {
    file: null, preview: null, name: "", nameTouched: false,
    locationId: "", customLocation: "", mockMode: "recognized",
    aiStatus: "IDLE", suggestedName: null, suggestedCategoryId: null,
    recognitionToken: 0, submitIntent: "save", errors: {},
  };
}

const ui = {
  detailId: null, inboxDetailId: null, editingId: null,
  toast: null, toastTimer: null, confirm: null,
  saving: false, draggedItemId: null, draggedSortId: null,
  add: createEmptyDraft(),
};

const icons = {
  search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
  box: '<path d="M4 7h16l-2 13H6L4 7Z"></path><path d="m7 7 2-3h6l2 3"></path>',
  plus: '<path d="M12 5v14M5 12h14"></path>',
  close: '<path d="m6 6 12 12M18 6 6 18"></path>',
  back: '<path d="m15 18-6-6 6-6"></path>',
  chevron: '<path d="m9 18 6-6-6-6"></path>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>',
  edit: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"></path>',
  check: '<path d="m5 12 4 4L19 6"></path>',
  alert: '<path d="M12 9v4M12 17h.01"></path><path d="M10.3 3.7 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"></path>',
  spark: '<path d="m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9L12 3ZM5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15Z"></path>',
  photo: '<rect x="3" y="4" width="18" height="16" rx="1"></rect><circle cx="9" cy="10" r="2"></circle><path d="m21 15-5-5L5 20"></path>',
  settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"></path>',
  menu: '<path d="M8 6h13M8 12h13M8 18h13"></path><circle cx="4" cy="6" r="1"></circle><circle cx="4" cy="12" r="1"></circle><circle cx="4" cy="18" r="1"></circle>',
  up: '<path d="m7 14 5-5 5 5"></path>',
  down: '<path d="m7 10 5 5 5-5"></path>',
};

const icon = (name, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
const formatDate = (value) => value ? new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value)) : "";
const categoryName = (id) => getState().categories.find((category) => category.category_id === id)?.name || "待整理箱";
const activeLocations = () => getState().locations.filter((entry) => entry.is_active).sort((a, b) => a.sort_order - b.sort_order);

function parseRoute() {
  const raw = location.hash.slice(1) || "/wardrobe";
  const [path, queryString = ""] = raw.split("?");
  return { path, params: new URLSearchParams(queryString) };
}

function nav(active = "wardrobe") {
  return `<header class="topbar"><a class="brand" href="#/wardrobe" aria-label="我的衣柜首页"><span class="brand-mark" aria-hidden="true"><span></span><span></span></span><span class="brand-copy">数字衣柜</span></a><nav class="desktop-nav" aria-label="一级导航"><a class="nav-link ${active === "wardrobe" ? "active" : ""}" href="#/wardrobe">衣柜</a><a class="nav-link ${active === "settings" ? "active" : ""}" href="#/settings">设置</a></nav></header><nav class="mobile-nav" aria-label="移动端一级导航"><a class="nav-link ${active === "wardrobe" ? "active" : ""}" href="#/wardrobe">${icon("box", 18)}<span>衣柜</span></a><a class="nav-link ${active === "settings" ? "active" : ""}" href="#/settings">${icon("settings", 18)}<span>设置</span></a></nav>`;
}

function shell(content, active = "wardrobe", classes = "") {
  return `<div class="app-shell ${classes}">${nav(active)}${content}${toastTemplate()}${confirmTemplate()}</div>`;
}

function pageHeader({ eyebrow, title, meta = "", back = "" }) {
  return `<div class="page-title-row"><div>${back ? `<a class="back-link" href="${back}">${icon("back", 18)}返回</a>` : ""}<p class="eyebrow">${escapeHTML(eyebrow)}</p><h1>${escapeHTML(title)}</h1>${meta ? `<p class="page-meta">${escapeHTML(meta)}</p>` : ""}</div></div>`;
}

function wardrobeDoors({ dropTargets = false } = {}) {
  const { categories, items } = getState();
  return `<section class="door-grid" aria-label="物品分类">${categories.map((category, index) => {
    const count = items.filter((item) => item.category_id === category.category_id).length;
    return `<button class="wardrobe-door" type="button" data-action="open-category" data-category-id="${category.category_id}" ${dropTargets ? `data-drop-category="${category.category_id}"` : ""}><span class="door-top"><span><span class="door-title">${escapeHTML(category.name)}</span><span class="door-count">${count} 件</span></span><span class="door-handle" aria-hidden="true"></span></span><span class="door-index">DOOR ${String(index + 1).padStart(2, "0")}</span></button>`;
  }).join("")}</section>`;
}

function homeContent({ withDrawer = false } = {}) {
  const { items } = getState();
  const inboxCount = items.filter((item) => item.category_id === null).length;
  return `<main class="page ${withDrawer ? "page-behind-drawer" : ""}"><div class="home-header"><div><p class="eyebrow">Digital Wardrobe</p><h1>我的衣柜</h1></div><a class="inbox-button" href="#/inbox" aria-label="打开待整理箱，共 ${inboxCount} 件物品">${icon("box")}<span class="label">待整理箱</span><span class="count-pill">${inboxCount}</span></a></div><a class="search-link" href="#/search">${icon("search")}<span>搜索物品名称，如“羽绒服”</span></a><div class="section-heading"><div><p class="eyebrow">Categories</p><h2>分类柜门</h2></div><p>${items.length} 件已记录物品</p></div>${wardrobeDoors({ dropTargets: withDrawer })}</main>${withDrawer ? "" : `<a class="add-button" href="#/add" aria-label="添加物品">${icon("plus")}<span class="label">添加物品</span></a>`}`;
}

function renderHome() { app.innerHTML = shell(homeContent()); }

function locationOptions(selected = "") {
  return `<option value="">尚未记录位置</option>${activeLocations().map((entry) => `<option value="${entry.location_id}" ${selected === entry.location_id ? "selected" : ""}>${escapeHTML(entry.name)}</option>`).join("")}`;
}

function categoryOptions(selected = "", includeInbox = true) {
  return `${includeInbox ? `<option value="" ${selected === null || selected === "" ? "selected" : ""}>待整理箱</option>` : ""}${getState().categories.map((entry) => `<option value="${entry.category_id}" ${selected === entry.category_id ? "selected" : ""}>${escapeHTML(entry.name)}</option>`).join("")}`;
}

function aiStatusTemplate() {
  const draft = ui.add;
  if (draft.aiStatus === "IDLE") return `<p class="status-copy neutral">上传图片后开始模拟识别。</p>`;
  if (draft.aiStatus === "PENDING") return `<p class="status-copy ai"><span class="spinner" aria-hidden="true"></span>正在识别物品信息… 你可以直接填写名称。</p>`;
  if (draft.aiStatus === "FAILED") return `<p class="status-copy neutral">暂未识别出物品信息，请补充名称后继续。</p>`;
  return `<div class="ai-suggestion">${icon("spark", 16)}<span>建议分类：${escapeHTML(categoryName(draft.suggestedCategoryId))}</span></div>`;
}

function renderAdd() {
  const draft = ui.add;
  const preview = draft.preview ? `<img src="${draft.preview}" alt="待添加物品预览" />` : `<div class="upload-empty">${icon("photo", 28)}<strong>上传一张物品图片</strong><span>支持拍照或从相册选择</span></div>`;
  const content = `<main class="page form-page">${pageHeader({ eyebrow: "Add item", title: "添加物品", meta: "图片和名称为必填；保存后统一进入待整理箱。", back: "#/wardrobe" })}<form class="item-form" data-form="add-item" novalidate><input type="hidden" name="intentValue" value="${draft.submitIntent}" /><section class="form-section image-upload-section"><div class="section-label"><span>01</span><div><h2>物品图片</h2><p>一件物品只上传一张主图</p></div></div><label class="image-uploader ${draft.errors.image ? "has-error" : ""}">${preview}<input type="file" name="image" accept="image/*" capture="environment" /><span class="upload-action">${draft.preview ? "更换图片" : "选择图片"}</span></label>${draft.errors.image ? `<p class="field-error">${escapeHTML(draft.errors.image)}</p>` : ""}</section><section class="form-section"><div class="section-label"><span>02</span><div><h2>识别与名称</h2><p>当前为模拟流程，不会调用真实 AI</p></div></div><div class="demo-control"><label for="mock-mode">模拟识别结果</label><select id="mock-mode" name="mockMode"><option value="recognized" ${draft.mockMode === "recognized" ? "selected" : ""}>识别成功</option><option value="failed" ${draft.mockMode === "failed" ? "selected" : ""}>识别失败</option></select></div>${aiStatusTemplate()}<label class="field-label" for="item-name">物品名称 <span aria-hidden="true">*</span></label><input class="text-input ${draft.errors.name ? "has-error" : ""}" id="item-name" name="name" value="${escapeHTML(draft.name)}" placeholder="如：黑色羽绒服" autocomplete="off" />${draft.errors.name ? `<p class="field-error">${escapeHTML(draft.errors.name)}</p>` : ""}</section><section class="form-section"><div class="section-label"><span>03</span><div><h2>储存位置</h2><p>选填，可稍后在详情中补充</p></div></div><label class="field-label" for="add-location">常用位置</label><select class="select-input" id="add-location" name="locationId">${locationOptions(draft.locationId)}</select><label class="field-label" for="custom-location">或新增位置</label><input class="text-input" id="custom-location" name="customLocation" value="${escapeHTML(draft.customLocation)}" placeholder="如：次卧衣柜 · 左侧抽屉" /></section>${draft.errors.submit ? `<div class="form-error">${escapeHTML(draft.errors.submit)}</div>` : ""}<div class="form-actions"><button class="button secondary" type="submit" name="intent" value="continue" ${ui.saving ? "disabled" : ""}>保存并继续添加</button><button class="button primary" type="submit" name="intent" value="save" ${ui.saving ? "disabled" : ""}>${ui.saving ? "正在保存…" : "保存到箱子"}</button></div></form></main>`;
  app.innerHTML = shell(content);
}

function itemCard(item) {
  return `<button class="item-card" type="button" data-action="open-item" data-item-id="${item.item_id}"><span class="item-image"><img src="${itemImage(item)}" alt="${escapeHTML(item.name)}" /></span><span class="item-name">${escapeHTML(item.name)}</span></button>`;
}

function inboxCard(item) {
  return `<article class="inbox-card" draggable="true" data-drag-item="${item.item_id}"><button class="inbox-card-main" type="button" data-action="open-inbox-item" data-item-id="${item.item_id}"><span class="inbox-thumb"><img src="${itemImage(item)}" alt="${escapeHTML(item.name)}" /></span><span class="inbox-info"><strong>${escapeHTML(item.name)}</strong>${item.storage_location_snapshot ? `<span>${escapeHTML(item.storage_location_snapshot)}</span>` : ""}${item.ai_suggested_category_id ? `<span class="ai-copy">${icon("spark", 13)} 建议：${escapeHTML(categoryName(item.ai_suggested_category_id))}</span>` : ""}</span></button><form class="quick-move" data-form="move-item" data-item-id="${item.item_id}"><select name="categoryId" aria-label="为 ${escapeHTML(item.name)} 选择分类"><option value="">移动到分类</option>${categoryOptions("", false)}</select><button type="submit" class="text-action">确定</button></form></article>`;
}

function inboxDrawer() {
  const items = getState().items.filter((item) => item.category_id === null);
  const selected = items.find((item) => item.item_id === ui.inboxDetailId);
  if (selected) return `<aside class="inbox-drawer" aria-label="物品详情"><div class="drawer-header"><button class="icon-button" type="button" data-action="inbox-back" aria-label="返回待整理箱">${icon("back")}</button><div><strong>物品详情</strong><span>待整理箱</span></div><a class="icon-button" href="#/wardrobe" aria-label="关闭">${icon("close")}</a></div><div class="drawer-scroll">${itemDetail(selected)}</div></aside>`;
  return `<aside class="inbox-drawer" aria-label="待整理箱"><div class="drawer-header"><div><strong>待整理箱</strong><span>${items.length} 件物品</span></div><a class="icon-button" href="#/wardrobe" aria-label="关闭">${icon("close")}</a></div><div class="drawer-hint">Desktop 可将物品拖入左侧柜门，也可以直接选择分类。</div><div class="drawer-scroll">${items.length ? `<div class="inbox-list">${items.map(inboxCard).join("")}</div>` : emptyState("箱子里暂无待分类物品", "新录入且尚未分类的物品会显示在这里。", "添加物品", "#/add")}</div></aside>`;
}

function renderInbox() { app.innerHTML = shell(`${homeContent({ withDrawer: true })}${inboxDrawer()}`, "wardrobe", "has-drawer"); }

function locationStatus(item) {
  if (item.location_status === "UNSET") return { label: "尚未记录位置", cls: "unset", detail: "添加位置后，之后查找时会显示在这里。" };
  if (item.location_status === "UNCERTAIN") return { label: "位置待确认", cls: "uncertain", detail: `上次记录：${item.storage_location_snapshot}` };
  return { label: item.storage_location_snapshot, cls: "recorded", detail: item.location_confirmed_at ? `确认于 ${formatDate(item.location_confirmed_at)}` : `更新于 ${formatDate(item.location_updated_at)}` };
}

function itemDetail(item) {
  if (ui.editingId === item.item_id) return editItemForm(item);
  const locationInfo = locationStatus(item);
  return `<div class="item-detail" data-item-id="${item.item_id}"><div class="detail-image"><img src="${itemImage(item)}" alt="${escapeHTML(item.name)}" /></div><div class="detail-title-row"><div><p class="eyebrow">Item</p><h2>${escapeHTML(item.name)}</h2></div><button class="icon-button" type="button" data-action="edit-item" data-item-id="${item.item_id}" aria-label="编辑物品">${icon("edit")}</button></div><section class="detail-section location-card ${locationInfo.cls}"><p class="detail-label">最后记录位置</p><strong>${escapeHTML(locationInfo.label)}</strong><span>${escapeHTML(locationInfo.detail)}</span><form class="inline-update" data-form="update-location" data-item-id="${item.item_id}"><select name="locationId" aria-label="更新储存位置">${locationOptions(item.storage_location_id || "")}</select><input name="customLocation" placeholder="或新增位置" aria-label="新增储存位置" /><button type="submit" class="button secondary compact">更新位置</button></form>${item.location_status === "RECORDED" ? `<div class="detail-actions"><button class="text-action" type="button" data-action="confirm-location" data-item-id="${item.item_id}">${icon("check", 16)}位置正确</button><button class="text-action warning" type="button" data-action="uncertain-location" data-item-id="${item.item_id}">${icon("alert", 16)}未在该位置找到</button></div>` : ""}</section><section class="detail-section"><p class="detail-label">当前分类</p><strong>${escapeHTML(categoryName(item.category_id))}</strong><form class="inline-move" data-form="move-item" data-item-id="${item.item_id}"><select name="categoryId" aria-label="移动物品到分类">${categoryOptions(item.category_id)}</select><button type="submit" class="button secondary compact">移动</button></form></section><div class="detail-footer"><button class="danger-action" type="button" data-action="ask-delete-item" data-item-id="${item.item_id}">${icon("trash", 17)}删除物品</button></div></div>`;
}

function editItemForm(item) {
  const imageInputId = `edit-image-${item.item_id}`;
  return `<form class="item-detail edit-detail" data-form="edit-item" data-item-id="${item.item_id}" novalidate><div class="detail-image editable"><img src="${itemImage(item)}" alt="${escapeHTML(item.name)}" /><input class="image-change-input" id="${imageInputId}" type="file" name="image" accept="image/*" aria-label="更换图片" /><label class="image-change" for="${imageInputId}">更换图片</label></div><div class="detail-title-row"><div><p class="eyebrow">Edit item</p><h2>编辑信息</h2></div><button class="icon-button" type="button" data-action="cancel-edit" aria-label="取消编辑">${icon("close")}</button></div><label class="field-label">物品名称</label><input class="text-input" name="name" value="${escapeHTML(item.name)}" required /><label class="field-label">常用位置</label><select class="select-input" name="locationId">${locationOptions(item.storage_location_id || "")}</select><label class="field-label">或新增位置</label><input class="text-input" name="customLocation" placeholder="输入新的完整位置名称" /><p class="helper-copy">分类通过详情中的“移动”单独修改。</p><button class="button primary full" type="submit">保存修改</button></form>`;
}

function detailContainer(item) {
  if (!item) return `<aside class="detail-panel empty-detail"><div>${icon("photo", 28)}<p>选择一件物品查看详情</p></div></aside>`;
  return `<aside class="detail-panel"><button class="detail-close icon-button" type="button" data-action="close-detail" aria-label="关闭详情">${icon("close")}</button><div class="detail-scroll">${itemDetail(item)}</div></aside>`;
}

function renderCategory(categoryId) {
  const category = getState().categories.find((entry) => entry.category_id === categoryId);
  if (!category) { location.hash = "#/wardrobe"; return; }
  const items = getState().items.filter((item) => item.category_id === categoryId);
  const selected = items.find((item) => item.item_id === ui.detailId);
  const content = `<main class="page browse-page">${pageHeader({ eyebrow: "Category", title: category.name, meta: `${items.length} 件物品`, back: "#/wardrobe" })}<div class="browse-layout"><section class="browse-main">${items.length ? `<div class="item-grid">${items.map(itemCard).join("")}</div>` : emptyState("这个分类还是空的", "可以从待整理箱选择物品，或添加一件新物品。", "打开待整理箱", "#/inbox", "添加物品", "#/add")}</section>${detailContainer(selected)}</div></main>`;
  app.innerHTML = shell(content);
}

function highlightName(name, query) {
  const index = name.toLocaleLowerCase("zh-CN").indexOf(query.toLocaleLowerCase("zh-CN"));
  if (index < 0) return escapeHTML(name);
  return `${escapeHTML(name.slice(0, index))}<mark>${escapeHTML(name.slice(index, index + query.length))}</mark>${escapeHTML(name.slice(index + query.length))}`;
}

function searchResult(item, query) {
  const locationInfo = locationStatus(item);
  return `<button class="search-result ${ui.detailId === item.item_id ? "selected" : ""}" type="button" data-action="open-item" data-item-id="${item.item_id}"><span class="result-thumb"><img src="${itemImage(item)}" alt="${escapeHTML(item.name)}" /></span><span class="result-info"><strong>${highlightName(item.name, query)}</strong><span class="result-location ${locationInfo.cls}">${escapeHTML(locationInfo.label)}${item.location_status === "UNCERTAIN" ? ` · ${escapeHTML(item.storage_location_snapshot)}` : ""}</span><span class="result-category">${escapeHTML(categoryName(item.category_id))}</span></span>${icon("chevron")}</button>`;
}

function renderSearch() {
  const { params } = parseRoute();
  const query = params.get("q") || "";
  const results = searchItems(query);
  const selected = getState().items.find((item) => item.item_id === ui.detailId);
  const stateContent = !query ? `<div class="search-prompt">${icon("search", 28)}<p>输入物品名称开始查找。</p></div>` : results.length ? `<div class="results-list">${results.map((item) => searchResult(item, query)).join("")}</div>` : emptyState("没有找到相关物品", "请检查名称，或确认是否已经录入。", "添加新物品", "#/add");
  const content = `<main class="page browse-page">${pageHeader({ eyebrow: "Search", title: "搜索", meta: "搜索全部已保存物品，包括待整理箱。", back: "#/wardrobe" })}<div class="search-input-wrap">${icon("search")}<input id="search-input" value="${escapeHTML(query)}" placeholder="搜索物品名称" autocomplete="off" autofocus /><button class="icon-button ${query ? "" : "hidden"}" type="button" data-action="clear-search" aria-label="清空搜索">${icon("close", 18)}</button></div><div class="browse-layout search-layout"><section class="browse-main">${query ? `<p class="results-count">${results.length} 个结果</p>` : ""}${stateContent}</section>${detailContainer(selected)}</div></main>`;
  app.innerHTML = shell(content);
  const input = document.querySelector("#search-input");
  if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
}

function renderSettings() {
  const content = `<main class="page settings-page">${pageHeader({ eyebrow: "Settings", title: "设置", meta: "管理分类和常用储存位置。" })}<div class="settings-list"><a href="#/settings/categories"><span class="settings-icon">${icon("menu")}</span><span><strong>分类管理</strong><small>${getState().categories.length} 个分类</small></span>${icon("chevron")}</a><a href="#/settings/locations"><span class="settings-icon">${icon("pin")}</span><span><strong>常用储存位置</strong><small>${activeLocations().length} 个位置</small></span>${icon("chevron")}</a></div></main>`;
  app.innerHTML = shell(content, "settings");
}

function categoryManager() {
  const { categories, items } = getState();
  return `<main class="page settings-page">${pageHeader({ eyebrow: "Settings / Categories", title: "分类管理", meta: "拖拽或使用箭头调整柜门顺序。", back: "#/settings" })}<form class="management-add" data-form="add-category"><input class="text-input" name="name" placeholder="新增分类名称" aria-label="新增分类名称" /><button class="button primary" type="submit">新增分类</button></form><div class="sortable-list">${categories.map((category, index) => `<article class="sortable-row" draggable="true" data-sort-category="${category.category_id}"><span class="drag-handle" aria-hidden="true">${icon("menu")}</span><form data-form="rename-category" data-category-id="${category.category_id}"><input name="name" value="${escapeHTML(category.name)}" aria-label="分类名称" /><span>${items.filter((item) => item.category_id === category.category_id).length} 件</span><button type="submit" class="text-action">保存</button></form><div class="row-actions"><button type="button" class="icon-button" data-action="move-category-up" data-category-id="${category.category_id}" ${index === 0 ? "disabled" : ""} aria-label="上移">${icon("up")}</button><button type="button" class="icon-button" data-action="move-category-down" data-category-id="${category.category_id}" ${index === categories.length - 1 ? "disabled" : ""} aria-label="下移">${icon("down")}</button><button type="button" class="icon-button danger" data-action="ask-delete-category" data-category-id="${category.category_id}" aria-label="删除分类">${icon("trash")}</button></div></article>`).join("")}</div></main>`;
}

function locationManager() {
  const locations = activeLocations();
  return `<main class="page settings-page">${pageHeader({ eyebrow: "Settings / Locations", title: "常用储存位置", meta: "移除位置不会清除已有物品中的历史记录。", back: "#/settings" })}<form class="management-add" data-form="add-location"><input class="text-input" name="name" placeholder="新增完整位置名称" aria-label="新增位置名称" /><button class="button primary" type="submit">新增位置</button></form><div class="sortable-list">${locations.map((entry, index) => `<article class="sortable-row" draggable="true" data-sort-location="${entry.location_id}"><span class="drag-handle" aria-hidden="true">${icon("menu")}</span><form data-form="rename-location" data-location-id="${entry.location_id}"><input name="name" value="${escapeHTML(entry.name)}" aria-label="位置名称" /><span>${getState().items.filter((item) => item.storage_location_id === entry.location_id).length} 件使用</span><button type="submit" class="text-action">保存</button></form><div class="row-actions"><button type="button" class="icon-button" data-action="move-location-up" data-location-id="${entry.location_id}" ${index === 0 ? "disabled" : ""} aria-label="上移">${icon("up")}</button><button type="button" class="icon-button" data-action="move-location-down" data-location-id="${entry.location_id}" ${index === locations.length - 1 ? "disabled" : ""} aria-label="下移">${icon("down")}</button><button type="button" class="text-action danger" data-action="ask-remove-location" data-location-id="${entry.location_id}">移除</button></div></article>`).join("")}</div></main>`;
}

function emptyState(title, description, action, href, secondAction = "", secondHref = "") {
  return `<div class="empty-state"><span class="empty-icon">□</span><h2>${escapeHTML(title)}</h2><p>${escapeHTML(description)}</p><div class="empty-actions"><a class="button secondary" href="${href}">${escapeHTML(action)}</a>${secondAction ? `<a class="text-action" href="${secondHref}">${escapeHTML(secondAction)}</a>` : ""}</div></div>`;
}

function toastTemplate() {
  return ui.toast ? `<div class="toast" role="status"><span>${escapeHTML(ui.toast.message)}</span>${ui.toast.actionLabel ? `<button type="button" data-action="toast-action">${escapeHTML(ui.toast.actionLabel)}</button>` : ""}</div>` : "";
}

function showToast(message, actionLabel = "", callback = null) {
  clearTimeout(ui.toastTimer); ui.toast = { message, actionLabel, callback }; render();
  ui.toastTimer = setTimeout(() => { ui.toast = null; render(); }, 3200);
}

function confirmTemplate() {
  if (!ui.confirm) return "";
  return `<div class="dialog-backdrop" role="presentation"><section class="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">${escapeHTML(ui.confirm.title)}</h2><p>${escapeHTML(ui.confirm.message)}</p><div><button type="button" class="button secondary" data-action="cancel-confirm">取消</button><button type="button" class="button danger-button" data-action="confirm-danger">${escapeHTML(ui.confirm.confirmLabel)}</button></div></section></div>`;
}

function render() {
  const { path } = parseRoute();
  if (path === "/wardrobe" || path === "/") return renderHome();
  if (path === "/add") return renderAdd();
  if (path === "/inbox") return renderInbox();
  if (path.startsWith("/category/")) return renderCategory(path.split("/")[2]);
  if (path === "/search") return renderSearch();
  if (path === "/settings") return renderSettings();
  if (path === "/settings/categories") { app.innerHTML = shell(categoryManager(), "settings"); return; }
  if (path === "/settings/locations") { app.innerHTML = shell(locationManager(), "settings"); return; }
  location.hash = "#/wardrobe";
}

function resetContext() { ui.detailId = null; ui.inboxDetailId = null; ui.editingId = null; ui.confirm = null; }
window.addEventListener("hashchange", () => { resetContext(); render(); });

app.addEventListener("click", (event) => {
  const intentButton = event.target.closest('button[type="submit"][name="intent"]');
  if (intentButton?.form?.dataset.form !== "add-item") return;
  ui.add.submitIntent = intentButton.value;
  const hiddenIntent = intentButton.form.elements.intentValue;
  if (hiddenIntent) hiddenIntent.value = intentButton.value;
}, true);

app.addEventListener("input", (event) => {
  if (parseRoute().path === "/add") {
    if (event.target.name === "name") { ui.add.name = event.target.value; ui.add.nameTouched = true; ui.add.errors.name = ""; }
    if (event.target.name === "customLocation") ui.add.customLocation = event.target.value;
  }
  if (event.target.id === "search-input") {
    const query = event.target.value;
    history.replaceState(null, "", query ? `#/search?q=${encodeURIComponent(query)}` : "#/search");
    renderSearch();
  }
});

app.addEventListener("change", (event) => {
  if (event.target.name === "locationId" && parseRoute().path === "/add") ui.add.locationId = event.target.value;
  if (event.target.name === "mockMode") { ui.add.mockMode = event.target.value; if (ui.add.file) startRecognition(); }
  if (event.target.name === "image" && parseRoute().path === "/add") {
    const [file] = event.target.files; if (!file) return;
    if (ui.add.preview) URL.revokeObjectURL(ui.add.preview);
    ui.add.file = file; ui.add.preview = URL.createObjectURL(file); ui.add.errors.image = ""; startRecognition();
  }
});

function startRecognition() {
  const token = ++ui.add.recognitionToken;
  ui.add.aiStatus = "PENDING"; ui.add.suggestedName = null; ui.add.suggestedCategoryId = null; renderAdd();
  setTimeout(() => {
    if (token !== ui.add.recognitionToken) return;
    if (ui.add.mockMode === "failed") ui.add.aiStatus = "FAILED";
    else { ui.add.aiStatus = "RECOGNIZED"; ui.add.suggestedName = "轻薄外套"; ui.add.suggestedCategoryId = "cat-tops"; if (!ui.add.nameTouched && !ui.add.name) ui.add.name = ui.add.suggestedName; }
    renderAdd();
  }, 750);
}

app.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target; const type = form.dataset.form; const data = new FormData(form);
  try {
    if (type === "add-item") {
      ui.add.name = String(data.get("name") || ""); ui.add.locationId = String(data.get("locationId") || ""); ui.add.customLocation = String(data.get("customLocation") || ""); ui.add.errors = {};
      if (!ui.add.file) ui.add.errors.image = "请上传物品图片";
      if (!ui.add.name.trim()) ui.add.errors.name = "请输入物品名称";
      if (Object.keys(ui.add.errors).length) { renderAdd(); return; }
      if (ui.saving) return;
      ui.saving = true; renderAdd();
      const finalAiStatus = ui.add.aiStatus === "RECOGNIZED" && ui.add.name.trim() !== ui.add.suggestedName ? "CORRECTED" : ui.add.aiStatus;
      const intent = String(data.get("intentValue") || event.submitter?.value || ui.add.submitIntent || "save");
      await createItem({ file: ui.add.file, name: ui.add.name, locationId: ui.add.locationId, customLocation: ui.add.customLocation, aiStatus: finalAiStatus, suggestedName: ui.add.suggestedName, suggestedCategoryId: ui.add.suggestedCategoryId });
      if (ui.add.preview) URL.revokeObjectURL(ui.add.preview); ui.add = createEmptyDraft(); ui.saving = false;
      if (intent === "continue") { renderAdd(); showToast("已保存到待整理箱，可以继续添加"); } else { location.hash = "#/wardrobe"; showToast("已保存到待整理箱"); }
      return;
    }
    if (type === "move-item") {
      const itemId = form.dataset.itemId; const targetId = String(data.get("categoryId") || "") || null; const previous = await assignCategory(itemId, targetId);
      const label = targetId ? `已移入「${categoryName(targetId)}」` : "已移回待整理箱";
      if (parseRoute().path === "/inbox" && targetId) ui.inboxDetailId = null;
      if (ui.detailId === itemId && parseRoute().path.startsWith("/category/") && targetId !== parseRoute().path.split("/")[2]) ui.detailId = null;
      showToast(label, "撤销", async () => { await assignCategory(itemId, previous); render(); }); return;
    }
    if (type === "update-location") { await setItemLocation(form.dataset.itemId, String(data.get("locationId") || "") || null, String(data.get("customLocation") || "")); showToast("储存位置已更新"); return; }
    if (type === "edit-item") {
      const imageFile = data.get("image"); const name = String(data.get("name") || "").trim();
      if (!name) { showToast("请输入物品名称"); return; }
      await updateItem(form.dataset.itemId, { file: imageFile?.size ? imageFile : null, name, locationId: String(data.get("locationId") || "") || null, customLocation: String(data.get("customLocation") || "") });
      ui.editingId = null; showToast("物品信息已更新"); return;
    }
    if (type === "add-category") { await addCategory(String(data.get("name") || "")); showToast("分类已新增"); return; }
    if (type === "rename-category") { await renameCategory(form.dataset.categoryId, String(data.get("name") || "")); showToast("分类名称已更新"); return; }
    if (type === "add-location") { await addLocation(String(data.get("name") || "")); showToast("常用位置已新增"); return; }
    if (type === "rename-location") { await renameLocation(form.dataset.locationId, String(data.get("name") || "")); showToast("位置名称已同步更新"); return; }
  } catch (error) {
    console.error(error); ui.saving = false;
    if (type === "add-item") { ui.add.errors.submit = "保存失败，请重试；当前表单内容已保留。"; renderAdd(); } else showToast(error.message || "操作失败，请重试");
  }
});

app.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]"); if (!target) return; const action = target.dataset.action;
  try {
    if (action === "open-category") { location.hash = `#/category/${target.dataset.categoryId}`; return; }
    if (action === "open-item") { ui.detailId = target.dataset.itemId; ui.editingId = null; render(); return; }
    if (action === "open-inbox-item") { ui.inboxDetailId = target.dataset.itemId; ui.editingId = null; renderInbox(); return; }
    if (action === "inbox-back") { ui.inboxDetailId = null; ui.editingId = null; renderInbox(); return; }
    if (action === "close-detail") { ui.detailId = null; ui.editingId = null; render(); return; }
    if (action === "edit-item") { ui.editingId = target.dataset.itemId; render(); return; }
    if (action === "cancel-edit") { ui.editingId = null; render(); return; }
    if (action === "clear-search") { history.replaceState(null, "", "#/search"); ui.detailId = null; renderSearch(); return; }
    if (action === "confirm-location") { await confirmItemLocation(target.dataset.itemId); showToast("已确认位置正确"); return; }
    if (action === "uncertain-location") { await markLocationUncertain(target.dataset.itemId); showToast("已标记位置待确认"); return; }
    if (action === "ask-delete-item") {
      const item = getState().items.find((entry) => entry.item_id === target.dataset.itemId);
      ui.confirm = { type: "item", id: item.item_id, title: "删除这件物品？", message: `“${item.name}”的图片、分类和位置记录都会被永久删除，V1 不提供回收站。`, confirmLabel: "确认删除" }; render(); return;
    }
    if (action === "ask-delete-category") {
      const category = getState().categories.find((entry) => entry.category_id === target.dataset.categoryId); const count = getState().items.filter((item) => item.category_id === category.category_id).length;
      ui.confirm = { type: "category", id: category.category_id, title: `删除“${category.name}”？`, message: count ? `该分类中的 ${count} 件物品会返回待整理箱，物品不会被删除。` : "这是一个空分类，删除后不会影响任何物品。", confirmLabel: "删除分类" }; render(); return;
    }
    if (action === "ask-remove-location") {
      const entry = getState().locations.find((locationEntry) => locationEntry.location_id === target.dataset.locationId);
      ui.confirm = { type: "location", id: entry.location_id, title: `移除“${entry.name}”？`, message: "它将不再出现在常用位置列表，已有物品的位置记录不受影响。", confirmLabel: "确认移除" }; render(); return;
    }
    if (action === "cancel-confirm") { ui.confirm = null; render(); return; }
    if (action === "confirm-danger") {
      const confirmation = ui.confirm; ui.confirm = null;
      if (confirmation.type === "item") { await deleteItem(confirmation.id); ui.detailId = null; ui.inboxDetailId = null; ui.editingId = null; showToast("物品已删除"); }
      if (confirmation.type === "category") { await deleteCategory(confirmation.id); showToast("分类已删除，相关物品已返回待整理箱"); }
      if (confirmation.type === "location") { await removeLocation(confirmation.id); showToast("已从常用位置中移除"); }
      return;
    }
    if (action === "toast-action") { const callback = ui.toast?.callback; clearTimeout(ui.toastTimer); ui.toast = null; if (callback) await callback(); else render(); return; }
    if (action.startsWith("move-category-")) {
      const ids = getState().categories.map((entry) => entry.category_id); const index = ids.indexOf(target.dataset.categoryId); const swap = action.endsWith("up") ? index - 1 : index + 1; [ids[index], ids[swap]] = [ids[swap], ids[index]]; await reorderCategories(ids); render(); return;
    }
    if (action.startsWith("move-location-")) {
      const ids = activeLocations().map((entry) => entry.location_id); const index = ids.indexOf(target.dataset.locationId); const swap = action.endsWith("up") ? index - 1 : index + 1; [ids[index], ids[swap]] = [ids[swap], ids[index]]; await reorderLocations(ids); render(); return;
    }
  } catch (error) { console.error(error); showToast(error.message || "操作失败，请重试"); }
});

app.addEventListener("dragstart", (event) => {
  const item = event.target.closest("[data-drag-item]"); const category = event.target.closest("[data-sort-category]"); const locationEntry = event.target.closest("[data-sort-location]");
  if (item) { ui.draggedItemId = item.dataset.dragItem; item.classList.add("dragging"); event.dataTransfer.effectAllowed = "move"; }
  if (category) { ui.draggedSortId = category.dataset.sortCategory; event.dataTransfer.setData("text/sort-type", "category"); }
  if (locationEntry) { ui.draggedSortId = locationEntry.dataset.sortLocation; event.dataTransfer.setData("text/sort-type", "location"); }
});

app.addEventListener("dragover", (event) => {
  const door = event.target.closest("[data-drop-category]"); const sortRow = event.target.closest("[data-sort-category], [data-sort-location]");
  if (door && ui.draggedItemId) { event.preventDefault(); door.classList.add("drag-over"); }
  if (sortRow && ui.draggedSortId) { event.preventDefault(); sortRow.classList.add("sort-over"); }
});

app.addEventListener("dragleave", (event) => event.target.closest("[data-drop-category], [data-sort-category], [data-sort-location]")?.classList.remove("drag-over", "sort-over"));

app.addEventListener("drop", async (event) => {
  event.preventDefault(); const door = event.target.closest("[data-drop-category]"); const categoryRow = event.target.closest("[data-sort-category]"); const locationRow = event.target.closest("[data-sort-location]");
  try {
    if (door && ui.draggedItemId) { const itemId = ui.draggedItemId; const categoryId = door.dataset.dropCategory; const previous = await assignCategory(itemId, categoryId); ui.draggedItemId = null; showToast(`已移入「${categoryName(categoryId)}」`, "撤销", async () => { await assignCategory(itemId, previous); render(); }); return; }
    if (categoryRow && ui.draggedSortId) { const ids = getState().categories.map((entry) => entry.category_id); const from = ids.indexOf(ui.draggedSortId); const to = ids.indexOf(categoryRow.dataset.sortCategory); ids.splice(to, 0, ids.splice(from, 1)[0]); await reorderCategories(ids); ui.draggedSortId = null; render(); return; }
    if (locationRow && ui.draggedSortId) { const ids = activeLocations().map((entry) => entry.location_id); const from = ids.indexOf(ui.draggedSortId); const to = ids.indexOf(locationRow.dataset.sortLocation); ids.splice(to, 0, ids.splice(from, 1)[0]); await reorderLocations(ids); ui.draggedSortId = null; render(); }
  } catch (error) { console.error(error); showToast("操作失败，请重试"); }
});

app.addEventListener("dragend", () => {
  ui.draggedItemId = null; ui.draggedSortId = null;
  document.querySelectorAll(".dragging,.drag-over,.sort-over").forEach((entry) => entry.classList.remove("dragging", "drag-over", "sort-over"));
});

function registerWebMCP() {
  const context = document.modelContext; if (!context?.registerTool) return;
  const register = (tool) => { try { void Promise.resolve(context.registerTool(tool)).catch(console.warn); } catch (error) { console.warn(error); } };
  register({ name: "search_wardrobe_items", title: "搜索衣柜物品", description: "按物品名称搜索数字衣柜中的全部已保存物品，包括待整理箱。", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: ({ query }) => searchItems(String(query)).map((item) => ({ item_id: item.item_id, name: item.name, category: categoryName(item.category_id), location_status: item.location_status, last_recorded_location: item.storage_location_snapshot })) });
  register({ name: "list_wardrobe_categories", title: "列出衣柜分类", description: "列出当前数字衣柜的分类和物品数量。", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: () => getState().categories.map((category) => ({ category_id: category.category_id, name: category.name, item_count: getState().items.filter((item) => item.category_id === category.category_id).length })) });
  register({ name: "move_wardrobe_item", title: "移动衣柜物品", description: "将已有物品移动到指定分类；category_id 为 null 时移回待整理箱。", inputSchema: { type: "object", properties: { item_id: { type: "string" }, category_id: { type: ["string", "null"] } }, required: ["item_id", "category_id"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, async execute({ item_id, category_id }) { if (!getState().items.some((item) => item.item_id === item_id)) throw new Error("物品不存在"); if (category_id !== null && !getState().categories.some((category) => category.category_id === category_id)) throw new Error("分类不存在"); await assignCategory(item_id, category_id); render(); return { item_id, category_id, classification_status: category_id === null ? "UNCLASSIFIED" : "CLASSIFIED" }; } });
}

async function boot() {
  try { await initializeStore(); if (!location.hash) location.hash = "#/wardrobe"; render(); registerWebMCP(); }
  catch (error) { console.error(error); app.innerHTML = `<main class="page fatal-state"><h1>暂时无法打开衣柜</h1><p>本地存储初始化失败，请刷新后重试。</p><button class="button secondary" onclick="location.reload()">重新加载</button></main>`; }
}

boot();
