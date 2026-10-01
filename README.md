# 数字衣柜 Demo

基于《AI智能收纳 Demo_数字衣柜_PRD_v1.0》和项目 Design System 实现的单用户 V1 网页 Demo。核心流程为：添加单件物品 → 保存到待整理箱 → 分类 → 分类浏览或名称搜索 → 查看详情 → 确认或更新储存位置。

## 本地运行

```bash
pnpm install
pnpm dev
```

默认访问 `http://127.0.0.1:5173/`。

```bash
pnpm test
pnpm build
```

## 实现范围

- 一级导航仅包含“衣柜 / 设置”。
- 新物品必须上传 1 张图片并填写名称，保存后始终先进入待整理箱。
- Desktop 支持从箱子拖入柜门，也提供点击分类；Mobile 使用点击分类。
- 搜索覆盖所有已保存物品，包括待整理箱，且只匹配物品名称。
- 详情组件统一承载编辑、移动分类、位置确认、位置更新、未找到和删除。
- 分类删除只让关联物品回到待整理箱；移除常用位置不会清除物品的历史位置记录。
- AI 识别是明确标注的本地状态模拟，不调用真实模型。
- 数据和上传图片保存在浏览器 IndexedDB 中，页面刷新后继续存在。

## 技术结构

- Vite + 原生 ES Modules
- Tailwind CSS Vite 插件与集中式 Design Tokens
- Hash Router
- IndexedDB Repository，UI 不直接读写浏览器数据库
- Vitest 状态转换测试

关键目录：

- `src/db.js`：IndexedDB、种子数据与事务
- `src/store.js`：应用数据操作与持久化协调
- `src/domain.js`：可测试的领域状态转换
- `src/main.js`：路由、视图组件与交互
- `src/style.css`：Design Tokens 与响应式样式
- `tests/domain.test.js`：核心状态规则测试

## 示例素材

`public/assets/items/` 中的 6 张单品图为本项目生成的原创本地素材，用于覆盖默认分类、待整理箱以及不同位置和 AI 状态。项目没有接入外部图片服务或真实 AI API。

