# Digital Wardrobe Design System

> Version: 1.0  
> Product: AI 智能收纳 Demo / 数字衣柜  
> Design Direction: **Soft Editorial Utility｜柔和编辑式工具界面**  
> Visual Reference: Editorial e-commerce grid systems, especially the structural clarity of adidas-style product interfaces  
> Scope: Desktop + Tablet + Mobile responsive web application

---

## 1. 整体设计方向

数字衣柜不直接复刻 adidas，而是提取其适合本产品的视觉特征：高秩序网格、大面积中性色、强信息层级、方正组件、低装饰、图片优先，以及明确的 Hover / Selected 状态。在此基础上降低强黑白对比，增加柔和灰白层次，减少纯黑大色块，同时保留网格秩序感。

### 1.1 Soft / Editorial / Utility

- **Soft**  
  使用低饱和中性色、柔和对比、白色表面与克制的视觉强调。界面应平静，适合日常个人物品管理，而不是呈现高商业感。区别于 adidas 更强的运动品牌气质，数字衣柜采用低饱和灰白体系、柔和边界与轻拟物柜门。

- **Editorial**  
  使用强网格、图片优先布局、简洁字体层级、清晰的信息层次与有纪律的留白。视觉参考来自编辑式时尚及电商界面，而不是常规的大圆角 SaaS 卡片。

- **Utility**  
  数字衣柜首先是管理与查找工具。搜索、添加、编辑、保存、分类、位置更新与数据录入必须优先保证效率，不能为了装饰牺牲可用性。

### 1.2 设计原则

1. **Grid First**：所有主要页面先建立明确、稳定的网格，再填充内容。
2. **Image First**：衣物与个人物品优先通过图片识别；浏览场景中图片应占据最强视觉位置。
3. **Low Saturation**：避免使用高饱和颜色和大面积彩色表面，不以高饱和色建立品牌感。
4. **White Surface First**：侧栏、Drawer、Detail Panel、表单与导航区域主要使用白色表面；通过留白和细分割线组织内容，而不是彩色卡片。
5. **Borders Instead of Shadows**：优先使用留白与细边框建立结构，不使用卡片阴影作为主要层级工具。
6. **Sharp but Soft**：组件整体保持方正，但避免纯黑带来的强硬对比。
7. **Explore Softly, Act Clearly**：浏览与衣柜探索可以保留轻拟物和柔和感；搜索、编辑、保存、分类和位置更新等任务型操作使用标准、直接的 UI 模式。
8. **AI Should Remain Secondary**：AI 状态和建议需要可识别，但不能主导界面。

---

## 2. 色彩体系

系统采用低饱和中性色。大面积彩色色块应尽量避免；页面主体由 **白色 + 暖灰白 + 冷灰 + 深色中性文字** 构成。Muted Sage 是唯一的主要产品强调色。

### 2.1 基础中性色

| Token | 色值 | 用途 |
|---|---:|---|
| `--color-bg-primary` | `#FAFAF8` | App 全局背景 |
| `--color-surface` | `#FFFFFF` | Drawer、Detail Panel、Bottom Sheet、表单与导航表面 |
| `--color-surface-soft` | `#F4F5F3` | 次级区域、输入框背景 |
| `--color-image-bg` | `#E9ECEB` | 物品图片统一背景 |
| `--color-text-primary` | `#171817` | 主文字 |
| `--color-text-secondary` | `#626660` | 次级信息 |
| `--color-text-tertiary` | `#959993` | 时间、元数据、辅助说明 |
| `--color-border` | `#E2E4E1` | 默认边框 |
| `--color-border-strong` | `#C9CCC8` | Hover / 重要分隔 |

不要使用纯 `#000000` 作为主文字色；统一使用 `#171817`，在保留清晰可读性的同时降低对比的攻击性。

### 2.2 Muted Sage 强调色

| Token | 色值 |
|---|---:|
| `--color-accent` | `#78857B` |
| `--color-accent-hover` | `#68766C` |
| `--color-accent-soft` | `#EEF1EE` |

强调色用于：

- 当前选中 Tab / Active navigation
- Selected 状态
- 柜门选中
- Focus state / Focus ring
- Drag target
- 当前分类
- 成功操作
- AI 推荐的小图标或轻量提示

**不得将强调色大面积铺作页面背景。**

### 2.3 语义色

| 状态 | 色值 |
|---|---:|
| Success | `#647668` |
| Warning | `#9B815F` |
| Error | `#A76464` |
| AI / Suggestion | `#747D8A` |

语义色同样保持低饱和。避免鲜艳的红、橙、绿、紫或蓝。例如“⚠ 位置待确认”使用灰棕 `#9B815F`，不使用鲜艳橙色。

---

## 3. 字体体系

字体系统需要兼顾中文界面的高可读性与编辑式层级。窄体不用于长篇中文正文。

### 3.1 字体分工

- **中文主字体**：`PingFang SC`
- **中文 fallback**：`"PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif`
- **英文、数字与常规 UI**：`Inter`
- **编辑式标题 / 英文标签**：`Roboto Condensed`

`Roboto Condensed` 用于英文 Section 标题、大数字标签、可选的全大写视觉标题和编辑式 Heading。未来如果出现英文产品名 `DIGITAL WARDROBE`，可使用 `Roboto Condensed / 700 / uppercase / letter-spacing 1–2px`。不要将窄体用于长篇中文正文。

### 3.2 字号层级

文字层级不超过 7 个等级。

| Style | 字号 | 字重 | 行高 |
|---|---:|---:|---:|
| Display | 40px | 700 | 1.05 |
| H1 | 32px | 700 | 1.15 |
| H2 | 24px | 650 | 1.20 |
| H3 | 20px | 600 | 1.30 |
| Body Large | 16px | 400 | 1.50 |
| Body | 14px | 400 | 1.50 |
| Caption | 12px | 400 | 1.40 |

### 3.3 移动端调整

屏幕宽度低于 `768px` 时：

| Desktop | Mobile |
|---|---:|
| Display 40px | 32px |
| H1 32px | 28px |
| H2 24px | 22px |
| H3 20px | 18px |

Body 字号保持不变。

### 3.4 文案与层级示例

| 场景 | 示例 | 规范 |
|---|---|---|
| 页面标题 | `我的衣柜` | `32px / 700` |
| 分类页标题 | `上装` | `28–32px` |
| 物品名称 | `黑色羽绒服` | `16px / 500–600`；浏览卡片可为 `14–16px / 500` |
| 位置信息 | `主卧衣柜 · 顶柜` | `14px / 400` |
| 元数据 | `更新于 2026/09/28` | `12px / 400` |

标题与产品文案应简洁、直接、少情绪化。使用“我的衣柜”，不使用“欢迎来到您的智能衣柜 ✨”一类文案。

---

## 4. 8pt Spacing

采用标准 **8pt spacing system**。基础半步为 `4px`，仅用于图标对齐等微布局调整。

| Token | 数值 |
|---|---:|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |

推荐用法：

| 场景 | 间距 |
|---|---:|
| 组件内部 Padding | `8–16px` |
| 卡片 / Grid gap | `12–16px` |
| 物品 Grid gap | `12px` |
| 模块间距 | `24–32px` |
| 大 Section 间隔 | `48px` |
| 页面级纵向间距 | `48–64px` |

不要随意使用 `13px / 21px / 37px` 等脱离该系统的间距。

---

## 5. Grid 与页面布局

### 5.1 页面最大宽度

| 页面 | 最大内容宽度 |
|---|---:|
| Wardrobe Home / Category Detail / Search / Item Grid | `1440px` |
| Settings | `720px` |

衣柜、分类、搜索可在大屏上接近全宽；低频的设置页不铺满整个 Desktop 宽度。

### 5.2 页面 Padding 与列数

| 设备 | Page Padding | 主结构 | 物品 Grid | 柜门 Grid |
|---|---:|---|---:|---:|
| Desktop | `32px` | 12-column grid，gutter `16px` | 4–5 列 | 空间允许时 4 列 |
| Tablet | `24px` | 按模块使用 2–3 列 | 3 列 | 2–3 列 |
| Mobile | `16px` | 大多数内容为单列结构 | 2 列 | 2 列 |

物品 Grid 不使用明显包裹每个 Item 的传统卡片；图片与文字自然组成一个单元。

```text
[   图片   ]
黑色羽绒服
```

---

## 6. 图片规范

图片是产品核心内容。V1 中每个已保存物品必须包含一张主图。

### 6.1 比例

默认物品卡片比例为 **4:5**：

```css
aspect-ratio: 4 / 5;
```

该比例适用于上装、外套、裤装、连衣裙和包，也能合理支持鞋类。此前讨论中的 `1:1` 仅作为鞋包展示的可选方向；本项目推荐并采用 `4:5`。

### 6.2 渲染

```css
object-fit: contain;
```

物品管理视图不使用 `cover`。图片不得裁掉袖子、裤腿、鞋尖或包体，用户必须能识别完整物品轮廓。

### 6.3 背景

图片容器统一使用浅冷灰背景 `#E9ECEB`，让不同拍摄背景的图片在网格中保持一致。

---

## 7. 圆角、Border 与 Shadow

### 7.1 圆角

界面整体保持方正，不将 `16px–24px` 大圆角卡片作为通用语言。

| 组件 | Radius |
|---|---:|
| Item Card | `0–2px` |
| 图片 | `0` |
| Button | `0–2px` |
| Input | `0–2px` |
| Wardrobe Door | `0–2px` |
| Detail Panel | `0` |
| Drawer | `0` |
| Toast | `2–4px` |
| Bottom Sheet | `12px 12px 0 0` |

### 7.2 Border

边框是界面主要结构工具之一。大面积面板使用白色表面，内部区域使用灰色细线划分。

```css
/* Default */
border: 1px solid #E2E4E1;

/* Hover */
border-color: #C9CCC8;

/* Selected / Focus */
border-color: #78857B;
```

不要频繁使用黑色描边。

### 7.3 Shadow

普通组件和普通卡片不使用 Shadow；优先使用 Border 与 Spacing。Shadow 仅保留给浮动 Overlay。

```css
/* Drawer / Bottom Sheet */
box-shadow: 0 8px 32px rgba(20, 24, 20, 0.08);
```

避免重阴影、卡片 Elevation System 和悬浮 Dashboard 式卡片。

---

## 8. Button / Input / Search Input

### 8.1 Primary Button

用于重要的提交动作，例如“保存到箱子”“保存修改”“确认删除”。

```text
Height: 48px
Radius: 0–2px
Background: #1B1D1B
Border: #1B1D1B
Text: #FFFFFF
Hover: #333633
Pressed: translateY(1px)
```

### 8.2 Secondary Button

用于“更新位置”“移动到分类”“打开箱子”。

```text
Background: #FFFFFF
Border: #C9CCC8
Text: #171817
Hover background: #F4F5F3
```

### 8.3 Tertiary / Text Button

用于“编辑”“撤销”“添加位置”“更换图片”。无填充背景，默认文字色 `#4F5650`，Hover 时使用下划线。

### 8.4 Danger Action

危险操作使用 `#A76464`，通常在确认前保持文字按钮形式，例如“删除物品”。普通详情页内避免使用大面积红色按钮；真正的确认界面才使用轻红色背景或红色文字。

### 8.5 Default Input

```text
Height: 48px
Background: #F4F5F3
Radius: 0–2px
Default border: 1px transparent
Hover border: #D8DAD7
Focus border: #78857B
Shadow: none
```

### 8.6 Search Input

搜索是主要效率入口，应明显、平直且结构化。

```text
Recommended height: 48–52px
Search icon: 20px
[ 🔍 搜索物品名称，如“羽绒服” ]
```

搜索框采用矩形，不使用大圆角胶囊造型。

---

## 9. Wardrobe Door 柜门组件

Wardrobe Door 表示物品分类，是产品中主要的轻拟物元素。它应让人联想到柜门，而不是写实地复制柜门。

### 9.1 结构

每扇柜门包含：

- 分类名称
- 物品数量
- 极简把手

```text
┌──────────────────────┐
│                      │
│ 上装              ─  │
│ 32 件                │
│                      │
└──────────────────────┘
```

### 9.2 视觉规则

```text
Background: #FFFFFF
Border: 1px solid #E2E4E1
Handle: 18–24px 横线或小型几何元素
Radius: 0–2px
```

不得使用木纹、金属纹理、写实铰链、强 3D 透视或装饰性阴影。

### 9.3 Hover

```css
border-color: #B9BEBA;
transform: translateY(-2px);
transition-duration: 180ms;
```

### 9.4 Selected

使用强调色 Border、主文字色与**可选的** Muted Sage 小指示。不要将整扇柜门填充为强调色。

---

## 10. Box / Inbox Drawer

Box 表示已保存但尚未分类的物品。它是正常物品状态，不是警告状态。

### 10.1 箱子按钮

位于 Wardrobe Home 右上角，显示 Box Icon 与未分类数量：

```text
[Box icon] 6
```

```text
Default: #626660
Hover: #171817
Count: 12px / Medium
```

数量背景**可以**使用 `#F0F1EF`。不得使用红色通知点或鲜艳 Badge。

### 10.2 Desktop Drawer

```text
Position: right
Recommended width: 360–420px
Default width: 400px
Alternative: 30vw; max-width: 440px
Background: #FFFFFF
Left border: 1px solid #E2E4E1
Shadow: extremely light
```

Header 示例：

```text
待整理箱
6 件物品
X
```

Drawer 不使用深色 Modal Overlay，因为拖放过程中衣柜必须保持可见、可交互。

### 10.3 Drawer Item

显示：

- 图片
- 物品名称
- 位置（如有）
- AI 建议分类（如有）
- “移动到分类”操作

不显示：

- 创建时间
- 内部 AI 状态
- 重复的“未分类”标签

---

## 11. Detail Panel

Detail Panel 是共享 Item Detail 组件在 Desktop 上的呈现形式，可从 Category Detail、Search Results 和 Box 打开。

### 11.1 布局与定位

```text
Recommended width: 30–35%
Default variable: 34%
Background: #FFFFFF
Left border: 1px solid #E2E4E1
Radius: 0
Strong shadow: none
```

在 Category Detail 中使用：

```css
position: sticky;
```

左侧 Grid 可以滚动，Detail Panel 保持可见，并保留左侧浏览上下文。

### 11.2 信息层级

1. 图片
2. 物品名称
3. 位置
4. 分类
5. 主要操作
6. 次要 / 危险操作

由于“找到物品”是核心任务，位置的视觉优先级高于分类。

---

## 12. Bottom Sheet

Bottom Sheet 是移动端的 Detail Panel、Box Drawer 与分类选择 Overlay。

### 12.1 容器

```text
Background: #FFFFFF
Top radius: 12px
Height: auto
Maximum height: 85vh
Shadow: light floating overlay shadow
```

### 12.2 Drag Handle

```text
Width: 32px
Height: 4px
Color: #C9CCC8
```

### 12.3 V1 行为

V1 最低要求：

- 打开
- 滚动完整内容
- 关闭
- 保留底层列表的位置

半屏 / 全屏两档 Snap 行为**可在未来增加**，不是 V1 的强制要求。

---

## 13. Toast

Toast 用于可撤销操作或已完成操作的简短反馈。

文案例：

```text
已移入「上装」 · 撤销
储存位置已更新
```

```text
Desktop position: bottom center
Mobile position: bottom navigation 上方
Background: #282B28
Text: #FFFFFF
Radius: 2–4px
Entrance: 200ms
Display duration: 2500–3500ms
Exit: 180ms
```

---

## 14. Hover / Pressed / Selected / Focus

所有交互状态应安静、精确，不使用卡通式弹簧动画。

### 14.1 Hover

所有可点击元素必须提供反馈。允许：文字颜色变化、Border 变化、背景轻微着色，以及最多 `2px` 的纵向位移。标准时长为 `180ms`。

避免：大幅 Scale、强阴影增长和弹跳。

### 14.2 Pressed

```css
transform: translateY(1px);
```

时长采用已确认的 `80–120ms`。

### 14.3 Selected

Selected 不只依赖背景色或颜色变化，而使用以下组合：

- 更强的 Border
- 主文字色
- Muted Sage 小指示

```text
Border: #78857B
Accent marker: #78857B
```

### 14.4 Focus

键盘操作必须有可见 Focus：

```css
outline: 2px solid #78857B;
outline-offset: 2px;
```

---

## 15. Drag 状态

Desktop 支持将 Box 中的物品拖放到 Wardrobe Door。

### 15.1 Drag Start

```text
Original item opacity: 0.4
Floating preview opacity: 0.95
```

### 15.2 Available Target

普通柜门保持中性，默认 Border 不变。AI 推荐分类可以显示轻量 Muted Sage 推荐指示，但不得自动高亮为已选目标。

### 15.3 Drag Over

```text
Target border: #78857B
Target background: #F1F4F1
Text: 放入「上装」
```

### 15.4 Invalid Drop

如果用户在无效目标处释放：

- 卡片返回 Box
- 不显示 Error Toast
- 不改变物品状态

### 15.5 Successful Drop

成功分类后：

- 从 Box 移除该物品
- 更新分类物品数量
- 显示 Toast
- 提供 Undo

```text
已移入「上装」 · 撤销
```

---

## 16. AI Interaction Style

AI 是辅助状态，不是界面身份，不得抢过主产品。

```text
✦ 建议：上装
Font size: 12px
Color: #747D8A
```

背景可以不使用；如果使用，**可选** `#F0F1F3`。避免紫色渐变、彩虹、发光边框、AI 星光大动画和大号 “AI powered” 标签。

---

## 17. Loading State

AI 识别文案例：

```text
正在识别物品信息…
```

使用小型 Spinner、轻量 Progress Line 和中性色。不要使用大面积闪烁 Skeleton。Loading 不得禁用手动物品名称输入。

---

## 18. Empty State

空状态保持极简，不使用卡通插画。

```text
Icon

一句状态

一句解释

Action
```

示例：

```text
□
箱子里暂无待分类物品
新录入且尚未分类的物品会显示在这里。
[ 添加物品 ]
```

---

## 19. Motion

| 类型 | 时长 | 用途 |
|---|---:|---|
| Micro | `120ms` | Icon、按钮状态 |
| Standard | `180ms` | Hover、Selected、Dropdown |
| Panel | `240ms` | Drawer、Bottom Sheet |

统一 Easing：

```css
cubic-bezier(.2, .8, .2, 1)
```

Pressed 状态使用已确认的 `80–120ms`；Toast 使用其独立的进入、停留和退出时长。不得使用弹簧式卡通动画。

---

## 20. Responsive Rules 与 Breakpoints

| 类型 | 宽度 |
|---|---:|
| Mobile | `< 768px` |
| Tablet | `768–1023px` |
| Desktop | `≥ 1024px` |
| Large Desktop | `≥ 1440px` |

响应式设计不能只是缩小 Desktop 布局；交互模型必须适应可用屏幕空间。

---

## 21. Desktop / Tablet / Mobile 规则

### 21.1 Desktop

- Page Padding：`32px`
- 12-column grid；Column gutter：`16px`
- Item Grid：4–5 列
- Wardrobe Door Grid：空间允许时 4 列
- Detail：右侧 Sticky Detail Panel
- Box：右侧 Drawer
- 分类同时支持 Drag & Drop 与 Click-to-select
- Bottom Navigation **可以**保留以维持结构一致性；主要入口为“衣柜”“设置”

### 21.2 Tablet

- Page Padding：`24px`
- Wardrobe：2–3 列
- Item Grid：3 列
- 在存在 Pointer Device 时，Drag & Drop 可以继续使用，但 Click 必须提供完整替代流程

### 21.3 Mobile

- Page Padding：`16px`
- Item Grid：2 列
- Wardrobe Door Grid：2 列
- Desktop Detail Panel 转为 Bottom Sheet
- Desktop Right Drawer 转为 Bottom Sheet / Full-screen Box
- 不要求跨屏 Drag & Drop；使用“移动到分类”并显示可选择的分类列表
- Desktop 搜索结果的 `Result list + Detail Panel` 转为 `Result list + Bottom Sheet`

移动端 Bottom Navigation：

```text
Height: 64px + safe-area
Background: #FFFFFF
Top border: 1px solid #E2E4E1
Active: #171817
Inactive: #959993
Active indicator: 2px accent line
```

不使用大面积彩色 Navigation Block。

---

## 22. Desktop / Mobile Component Mapping

| Desktop | Mobile |
|---|---|
| Sticky Detail Panel | Bottom Sheet |
| Right Box Drawer | Bottom Sheet / Full screen |
| Drag & Drop | Click-to-select |
| 4–5 column Item Grid | 2-column Grid |
| `32px` Page Padding | `16px` Page Padding |
| Wide Search Result Layout | Single-column Results |
| Persistent Contextual Detail | Temporary Overlay Detail |

---

## 23. Accessibility

- 最小交互点击区：`44 × 44px`
- 正文对比度目标：WCAG AA / 约 `4.5:1` 以上
- 图片必须包含 `alt = 物品名称`
- 所有 Drag & Drop 功能必须提供 Click-based Alternative
- Keyboard Focus 必须清晰可见，并使用 Sage Outline
- Selected、Warning、Error 与 Active 状态不能仅通过颜色表达

---

## 24. CSS Variables / Design Tokens

以下变量仅映射本文已经确认的数值。正文中标为“推荐”“可以”“可选”或“未来增加”的规则仍保持其非强制属性。

```css
:root {
  /* =========================
     Colors
     ========================= */

  --color-bg-primary: #FAFAF8;

  --color-surface: #FFFFFF;
  --color-surface-soft: #F4F5F3;
  --color-image-bg: #E9ECEB;

  --color-text-primary: #171817;
  --color-text-secondary: #626660;
  --color-text-tertiary: #959993;

  --color-border: #E2E4E1;
  --color-border-strong: #C9CCC8;
  --color-border-input-hover: #D8DAD7;
  --color-border-wardrobe-hover: #B9BEBA;

  --color-accent: #78857B;
  --color-accent-hover: #68766C;
  --color-accent-soft: #EEF1EE;

  --color-success: #647668;
  --color-warning: #9B815F;
  --color-error: #A76464;
  --color-ai: #747D8A;

  --color-button-primary: #1B1D1B;
  --color-button-primary-hover: #333633;
  --color-text-action: #4F5650;
  --color-toast-bg: #282B28;
  --color-drag-target-bg: #F1F4F1;
  --color-ai-bg-optional: #F0F1F3;

  /* =========================
     Typography
     ========================= */

  --font-family-cn:
    "PingFang SC",
    "Noto Sans SC",
    "Microsoft YaHei",
    sans-serif;

  --font-family-ui:
    "Inter",
    "PingFang SC",
    "Noto Sans SC",
    sans-serif;

  --font-family-editorial:
    "Roboto Condensed",
    "Inter",
    sans-serif;

  --font-size-caption: 12px;
  --font-size-body: 14px;
  --font-size-body-lg: 16px;
  --font-size-h3: 20px;
  --font-size-h2: 24px;
  --font-size-h1: 32px;
  --font-size-display: 40px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-h3: 600;
  --font-weight-h2: 650;
  --font-weight-bold: 700;

  --line-height-caption: 1.4;
  --line-height-body: 1.5;
  --line-height-h3: 1.3;
  --line-height-h2: 1.2;
  --line-height-h1: 1.15;
  --line-height-display: 1.05;

  /* =========================
     Spacing
     ========================= */

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* =========================
     Radius
     ========================= */

  --radius-xs: 2px;
  --radius-toast: 4px;
  --radius-sheet: 12px;

  /* =========================
     Borders & Shadow
     ========================= */

  --border-width-default: 1px;
  --focus-outline-width: 2px;
  --focus-outline-offset: 2px;
  --shadow-overlay: 0 8px 32px rgba(20, 24, 20, 0.08);

  /* =========================
     Motion
     ========================= */

  --motion-fast: 120ms;
  --motion-standard: 180ms;
  --motion-panel: 240ms;
  --motion-pressed-min: 80ms;
  --motion-pressed-max: 120ms;
  --motion-toast-enter: 200ms;
  --motion-toast-exit: 180ms;
  --motion-toast-display-min: 2500ms;
  --motion-toast-display-max: 3500ms;
  --motion-easing: cubic-bezier(.2, .8, .2, 1);

  /* =========================
     Layout
     ========================= */

  --page-padding-desktop: 32px;
  --page-padding-tablet: 24px;
  --page-padding-mobile: 16px;
  --grid-gutter: 16px;
  --item-grid-gap: 12px;

  --max-content: 1440px;
  --max-settings: 720px;

  --breakpoint-mobile: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-large-desktop: 1440px;

  /* =========================
     Images & Controls
     ========================= */

  --item-image-aspect-ratio: 4 / 5;
  --control-height: 48px;
  --search-height-min: 48px;
  --search-height-max: 52px;
  --search-icon-size: 20px;
  --interactive-target-min: 44px;

  /* =========================
     Panels
     ========================= */

  --detail-panel-width: 34%;
  --drawer-width: 400px;
  --drawer-width-min: 360px;
  --drawer-width-max: 420px;
  --drawer-width-alt-max: 440px;
  --bottom-sheet-max-height: 85vh;
  --bottom-sheet-handle-width: 32px;
  --bottom-sheet-handle-height: 4px;
  --bottom-navigation-height: 64px;
}

@media (max-width: 767px) {
  :root {
    --font-size-display: 32px;
    --font-size-h1: 28px;
    --font-size-h2: 22px;
    --font-size-h3: 18px;
  }
}
```

---

## 25. 视觉总结

> **以 adidas 式编辑网格和高信息秩序为视觉参考，通过低饱和灰白色系、极轻拟物柜门和标准化工具组件，将运动品牌式的强黑白视觉转化为更柔和的个人数字衣柜界面；浏览场景强调图片与空间感，操作场景强调效率与清晰反馈。**
