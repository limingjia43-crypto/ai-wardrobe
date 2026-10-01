# 数字衣柜网页 Demo Implementation Plan

## 1. 产品闭环与交付目标

核心闭环为：

**上传单件图片并确认名称 → 保存到待整理箱 → 点击或拖拽分类 → 分类浏览或名称搜索 → 打开统一详情 → 确认、更新或标记储存位置待确认。**

交付范围：

- 在 `/Users/ellenmac/Desktop/ai wardrobe` 从零构建。
- 交付原生 HTML、Tailwind CSS、JavaScript 源码和启动说明。
- 提供持续热更新的本地实时预览，不部署公网。
- 所有数据仅保存在当前浏览器，不实现账号、云同步或真实 AI。
- 首次运行预置 4 个默认分类、3 个常用位置和 6 件原创示例物品；初始化只执行一次，用户清空物品后不自动重新生成。

## 2. 技术与架构

- 使用 Vite 的 `vanilla` 模板组织原生 ES Modules，使用官方 `@tailwindcss/vite` 集成 Tailwind；不引入 React、Vue 或组件框架。[Vite 官方指南](https://vite.dev/guide/)、[Tailwind 官方 Vite 指南](https://tailwindcss.com/docs/installation)
- 采用单页 Hash Router，保证本地预览和静态构建刷新稳定：
  - `#/wardrobe`
  - `#/add`
  - `#/inbox`
  - `#/category/:categoryId`
  - `#/search?q=`
  - `#/settings`
  - `#/settings/categories`
  - `#/settings/locations`
- 详情由当前路由的 `item` 参数控制，从箱子、分类和搜索进入后，关闭详情仍保留原列表、查询词和滚动位置。
- 数据层采用 Repository 接口隔离 UI 与 IndexedDB；建立 `items`、`categories`、`locations`、`assets`、`meta` 存储区。上传图片以 Blob 保存，`image_url` 使用可解析的本地资源引用，未来可替换为后端 URL。
- 所有跨记录变更使用事务：分类删除与物品回箱、位置重命名与关联快照更新、物品与图片删除不能产生半完成状态。
- Design System 的颜色、字体、间距、圆角、阴影、动效和断点全部集中映射为 CSS/Tailwind Theme Tokens，组件不得自行散落新数值。
- 浏览器支持 `document.modelContext` 时，可注册只复用现有数据操作的轻量 WebMCP 接口，如名称搜索、读取分类和移动分类；不支持时静默跳过，不增加可见功能。

## 3. 页面与组件结构

### 页面

- **衣柜首页**：标题、箱子数量、搜索入口、响应式柜门网格、添加按钮，以及仅包含“衣柜 / 设置”的一级导航。
- **添加物品**：单图上传、图片预览、AI 模拟状态、必填名称、建议分类、可选位置、“保存到箱子”和“保存并继续添加”。
- **待整理箱**：桌面为无深色遮罩的右侧 Drawer；移动端使用全屏页面，避免箱子与详情出现嵌套 Bottom Sheet。
- **分类详情**：桌面 Grid + Sticky Detail Panel，移动端 2 列 Grid + Item Detail Bottom Sheet。
- **搜索**：实时名称包含匹配；桌面结果列表 + Detail Panel，移动端结果列表 + Bottom Sheet。
- **设置**：只提供分类管理和常用储存位置管理两个入口。
- **分类管理**：新增、重命名、排序、删除；删除非空分类前显示受影响数量。
- **位置管理**：新增、重命名、排序和从常用列表移除。

### 共享组件

- `Navigation`、`SearchInput`、`WardrobeDoor`
- `ItemCard`、`ItemGrid`、`SearchResult`
- `InboxDrawer`、`InboxItem`
- `ItemDetail`、`BottomSheet`
- `ImageUploader`、`CategoryPicker`、`LocationPicker`
- `AIDemoControl`、`Toast`、`ConfirmDialog`
- `SortableList`、`EmptyState`

Desktop 箱子内点击物品后，在同一个约 400px Drawer 内从列表切换到详情，并提供返回箱子列表；衣柜始终保持可见。Desktop 一级导航放在顶部，Mobile 使用固定底部导航。

## 4. 数据模型与状态规则

### Item

保留 PRD 字段：

- `item_id`、`user_id`
- `image_url`、`name`
- `ai_suggested_name`、`ai_suggested_category_id`
- `category_id`
- `storage_location_id`、`storage_location_snapshot`
- `location_status`: `UNSET | RECORDED | UNCERTAIN`
- `ai_status`: `IDLE | PENDING | RECOGNIZED | FAILED | CORRECTED`
- `location_updated_at`、`location_confirmed_at`
- `created_at`、`updated_at`

`classification_status` 不重复持久化，统一由 `category_id` 派生：

- `null` → `UNCLASSIFIED`
- 非空 → `CLASSIFIED`

删除物品执行物理删除，不保存 `DELETED` 记录。

### Category

- `category_id`、`user_id`、`name`
- `sort_order`、`created_at`、`updated_at`
- 默认分类：上装、下装、鞋子、包包
- 名称去除首尾空格后进行完全同名校验。

### StorageLocation

- `location_id`、`user_id`、`name`
- `sort_order`、`is_active`
- `created_at`、`updated_at`
- 从常用位置移除只设置 `is_active=false`；历史物品的位置文本和关联保留。
- 重命名位置时，同一事务更新仍关联该位置的物品快照。

### 关键状态行为

- 新物品无论 AI 建议什么，都以 `category_id=null` 保存。
- 搜索覆盖所有已保存物品，包括待整理箱。
- 分类删除时仅清空关联物品的 `category_id`，不修改 `created_at`。
- 拖拽分类成功保存原分类以支持短时撤销；无效放置不写数据。
- “位置正确”只更新 `location_confirmed_at`。
- “未找到”保留位置文本并切换为 `UNCERTAIN`。
- AI 控件明确标注为模拟：选图后先进入 `PENDING`，再按用户选择进入 `RECOGNIZED` 或 `FAILED`；用户修改建议名称后为 `CORRECTED`。迟到结果不得覆盖已经编辑的名称。

## 5. 视觉、响应式与示例内容

- 严格采用 Soft Editorial Utility：灰白背景、低饱和 Sage 强调色、细边框、方正组件、极轻浮层阴影。
- 物品图片统一使用 4:5 浅灰容器和 `object-fit: contain`。
- 柜门只使用模块化矩形、边框和极简把手，不使用木纹、写实五金或复杂 3D。
- Desktop：12 列结构、4–5 列物品网格、4 列柜门、右侧详情或箱子 Drawer。
- Tablet：2–3 列柜门、3 列物品网格。
- Mobile：2 列柜门和物品网格；详情 Bottom Sheet；分类仅依赖点击选择。
- 所有交互区至少 44×44px，提供键盘焦点、图片 alt、拖拽的点击替代方案，并尊重 `prefers-reduced-motion`。
- 生成 6 张原创、本地保存的低饱和单品图，不使用 adidas 截图作为产品内容：4 件分别覆盖默认分类，2 件位于待整理箱；示例数据覆盖 `UNSET / RECORDED / UNCERTAIN` 和不同 AI 状态。

## 6. 开发顺序与验证

1. 初始化 Vite Vanilla + Tailwind 工程，建立 Tokens、路由、App Shell、数据 Repository 和一次性种子迁移。
2. 完成衣柜首页、导航、柜门和示例数据，启动实时预览作为第一版可识别界面。
3. 完成图片持久化、添加表单、AI 模拟、校验、防重复提交和连续录入。
4. 完成待整理箱、点击分类、Desktop 拖拽、高亮、无效放置及撤销。
5. 完成分类详情、名称搜索和统一 Item Detail。
6. 完成物品编辑、分类移动、位置确认/更新/待确认及删除。
7. 完成分类和常用位置管理，以及所有删除影响提示。
8. 完成 Mobile Bottom Sheet、全屏箱子、滚动位置恢复和键盘可达性。
9. 执行构建、自动化测试和 AC01–AC25 手工验收，并在实时预览中检查 Desktop 与 Mobile。

自动化测试覆盖：

- 新物品永远先进入箱子，AI 分类建议不自动生效。
- 箱子与分类互斥、移动与撤销正确更新计数。
- 删除分类后物品回箱且保持原创建时间。
- 搜索能找到待整理箱物品，且只搜索名称。
- 位置重命名、移除、确认和待确认状态正确。
- AI 迟到结果不覆盖人工输入。
- IndexedDB 刷新后保持物品、图片、分类和位置。
- Desktop 拖拽流程与 Mobile 点击分类流程等价。
- 375px、768px、1024px、1440px 下无异常横向滚动或不可达操作。

## 7. 文档冲突与已确定解释

PRD、Design System 与本次请求之间没有硬性冲突。以下是文档留有选择空间的地方，已按本计划固定：

- Mobile 箱子采用全屏页面，物品详情采用 Bottom Sheet。
- Desktop 箱子详情在 Drawer 内切换，不叠加第二个右侧面板。
- Desktop 使用顶部一级导航，Mobile 使用底部一级导航；两端都只包含衣柜和设置。
- 常用位置选择器中创建的新位置会成为新的活动 `StorageLocation`；不把任意文本保存为无法管理的隐藏位置。
- 示例数据是本次确认后的 Demo 展示内容，不新增重置、导入、批量处理等 PRD 外功能。
- 参考图只用于理解编辑式网格与信息层级，不复制 adidas 品牌、文案、商品图片或商业功能。
