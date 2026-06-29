# 摇一摇

一个基于 React + Vite 的单页周易摇卦网站。页面以中国传统易经和水墨视觉为方向，支持桌面端和移动端自适应，核心流程为三枚铜钱六次成爻，并生成本卦、动爻和之卦信息。

> 娱乐为主，切勿迷信。

## 功能

- 三枚铜钱起卦，六次投掷生成六爻
- 按 6 / 7 / 8 / 9 推导阴爻、阳爻、老阴、老阳
- 根据六爻映射 64 卦，展示本卦、动爻和之卦
- 六十四卦卦库，支持按卦序、卦名、卦辞和关键词搜索
- 一键复制 AI 解卦提示词
- 铜钱翻转动效、山水背景动效和响应式布局
- WebP 素材优化，改善移动端加载速度

## 技术栈

- React 19
- Vite 6
- CSS 原生响应式布局
- Cloudflare Pages 部署

## 本地开发

```bash
npm install
npm run dev
```

默认本地服务地址：

```text
http://127.0.0.1:5173/
```

## 常用命令

```bash
npm test
npm run build
npm run preview
```

说明：

- `npm test`：运行摇卦逻辑测试
- `npm run build`：生成生产构建产物
- `npm run preview`：本地预览生产构建

## Cloudflare Pages 部署

推荐配置：

| 配置项 | 值 |
| --- | --- |
| Framework preset | React (Vite) |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

如需设置 Node 版本，建议使用：

```text
NODE_VERSION=20
```

仓库内的 `wrangler.toml` 也指定了 Pages 输出目录：

```toml
name = "yaoyiyao"
pages_build_output_dir = "dist"
```

## 项目结构

```text
.
├── public/assets/       # 页面图片素材
├── public/assets/hexagrams/
│   └── hexagram-*.webp  # 64 卦原页图片
├── src/App.jsx          # 页面结构与交互
├── src/iching.js        # 摇卦和 64 卦推导逻辑
├── src/iching.test.js   # 核心逻辑测试
├── src/styles.css       # 视觉、动效和响应式样式
├── index.html
├── package.json
├── vite.config.mjs
└── wrangler.toml
```

## 摇卦逻辑

每次起爻同时投掷三枚铜钱：

- 正面记 3
- 反面记 2
- 三枚相加得到 6 / 7 / 8 / 9

爻值对应关系：

| 点数 | 爻象 | 是否动爻 |
| --- | --- | --- |
| 6 | 老阴 | 是 |
| 7 | 少阳 | 否 |
| 8 | 少阴 | 否 |
| 9 | 老阳 | 是 |

六爻自下而上成卦。老阴、老阳作为动爻，在之卦中翻转。

## 素材说明

主要素材位于 `public/assets/`。首屏关键素材优先使用 WebP 版本，例如：

- `bronze-coin.webp`
- `shanshui-bg.webp`
- `result-frame.webp`

64 卦原页图片位于 `public/assets/hexagrams/`，文件名按卦序编号：

```text
hexagram-01.webp ... hexagram-64.webp
```

PNG 文件保留为原始或兼容素材。移动端加载慢时，优先检查首屏素材体积和 Cloudflare 缓存状态。

## 版权

© 2026 摇一摇. All rights reserved.
