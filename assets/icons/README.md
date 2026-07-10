# 城市浮生记 — 微信小程序图标集

> 品牌色：`#4a9e5c`（绿） | 夜空：`#1a1a2e` → `#0f3460`

---

## 图标清单

| 文件名                     | 用途                   | 建议尺寸  | 说明                             |
| -------------------------- | ---------------------- | --------- | -------------------------------- |
| `icon-app.svg`             | 小程序主图标（详情版） | 1024×1024 | 夜景城市 + 品牌绿建筑 + 人物剪影 |
| `icon-app-simple.svg`      | 小程序主图标（简化版） | 1024×1024 | 同上，更简洁，小尺寸可识别       |
| `icon-splash.svg`          | 启动页/加载页          | 750×1334  | 城市天际线 + 游戏名              |
| `icon-tab-home.svg`        | 底部 Tab — 首页        | 100×100   | 房子图标                         |
| `icon-tab-explore.svg`     | 底部 Tab — 探索/地图   | 100×100   | 指南针图标                       |
| `icon-tab-shop.svg`        | 底部 Tab — 商城        | 100×100   | 购物袋 + ¥                       |
| `icon-tab-profile.svg`     | 底部 Tab — 我的        | 100×100   | 人像图标                         |
| `icon-tab-job.svg`         | 底部 Tab — 职业/工作   | 100×100   | 公文包图标                       |
| `icon-tab-news.svg`        | 底部 Tab — 消息/新闻   | 100×100   | 对话气泡                         |
| `icon-tab-achievement.svg` | 成就/排行榜            | 100×100   | ↕ 奖杯（金橙色）                 |
| `icon-nav-back.svg`        | 导航栏返回箭头         | 100×100   | ← 箭头                           |
| `icon-nav-close.svg`       | 导航栏关闭按钮         | 100×100   | ✕ 叉号                           |

---

## 微信小程序配置

### app.json 配置参考

```json
{
  "pages": ["pages/index/index", "pages/game/game", "pages/profile/profile"],
  "window": {
    "navigationBarTitleText": "城市浮生记",
    "navigationBarBackgroundColor": "#1a1a2e",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#0f3460",
    "backgroundTextStyle": "light"
  },
  "tabBar": {
    "color": "#8a8a8a",
    "selectedColor": "#4a9e5c",
    "backgroundColor": "#1a1a2e",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "assets/icons/png/tab-home.png",
        "selectedIconPath": "assets/icons/png/tab-home-active.png"
      },
      {
        "pagePath": "pages/game/game",
        "text": "探索",
        "iconPath": "assets/icons/png/tab-explore.png",
        "selectedIconPath": "assets/icons/png/tab-explore-active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的",
        "iconPath": "assets/icons/png/tab-profile.png",
        "selectedIconPath": "assets/icons/png/tab-profile-active.png"
      }
    ]
  }
}
```

### 主动图标（小程序头像）

- **尺寸**：微信小程序后台要求 **180×180px** PNG（建议源文件 1024×1024）
- **提交路径**：微信公众平台 → 设置 → 基本设置 → 小程序图标
- **建议**：使用 `icon-app-simple.svg` 转 PNG

### 启动页图标

- **尺寸**：微信要求 750×1334px PNG
- **背景**：使用 `icon-splash.svg` 转 PNG
- **alt 方案**：纯色背景 `#1a1a2e` + 白色游戏名 + 品牌绿副标题

---

## SVG → PNG 转换方法

### 方法 1：在线工具

1. 打开 [svgtopng.com](https://svgtopng.com) 或 [convertio.co](https://convertio.co)
2. 上传 SVG，设置输出尺寸
3. 导出 PNG

### 方法 2：Node.js 脚本

```bash
# 安装 sharp
npm install sharp

# 批量转换
node -e "
const sharp = require('sharp');
const fs = require('fs');
const files = [
  'icon-app', 'icon-app-simple',
  'icon-tab-home', 'icon-tab-explore', 'icon-tab-shop',
  'icon-tab-profile', 'icon-tab-job', 'icon-tab-news',
  'icon-tab-achievement'
];
files.forEach(f => {
  sharp('assets/icons/' + f + '.svg')
    .resize(180, 180)
    .png()
    .toFile('assets/icons/png/' + f + '.png')
    .then(() => console.log(f + '.png done'));
});
"
```

### 方法 3：浏览器截图法

1. 浏览器打开 SVG
2. DevTools → 模拟设备（如 iPhone 12 Pro / 390×844）
3. 截取元素 → 导出的 PNG 就是需要的大小

---

## 设计规范

- **色调**：深蓝夜空 `#1a1a2e` + 品牌绿 `#4a9e5c`
- **风格**：线性图标，2px 描边（Tab）/ 4px 描边（导航），圆头端点
- **激活态**：Tab 选中时用品牌绿填充/实心，未选中时灰色描边
- **主图标**：圆角矩形 `rx=180/1024≈17.5%`（符合微信圆角规范）

## 主动图标备选配色

| 方案            | 背景              | 建筑             | 月亮    | 场景   |
| --------------- | ----------------- | ---------------- | ------- | ------ |
| 🌙 夜景（当前） | `#1a1a2e→#0f3460` | 品牌绿 `#4a9e5c` | 🌕 暖黄 | 推荐   |
| 🌅 黄昏         | `#2d1b69→#e76f51` | 暖橙 `#f4a261`   | ☀️ 落日 | 温暖感 |
| 🌿 清晨         | `#264653→#2a9d8f` | 亮绿 `#6bbf7c`   | 🌤️ 淡白 | 活力感 |
