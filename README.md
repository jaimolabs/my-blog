<div align="center">

# JaiMo Blogs

**A modular static blog and personal knowledge base template.**

**模块化静态博客与个人知识库模板。**

<a href="#english">English</a>  |  <a href="#中文">简体中文</a>

</div>

---

# English

## 📂 Project Structure

```text
jaimo-blogs/
├── 📄 index.html                 # Home page
├── 📄 article.html               # Article database page
├── 📄 buildDatabar.py            # Article database configuration generator
│
├── 📁 database/                  # HTML articles organized by category
│   ├── 📁 products/              # Product-related articles
│   ├── 📁 python/                # Python learning notes
│   └── 📁 topics/                # Technical topics and research
│
├── 📁 images/                    # Static images
│   ├── 🖼️ avatar.png
│   └── 🖼️ background.png
│
├── 📁 js/
│   ├── 📁 core/                  # Shared core modules
│   │   ├── 📜 navbar.js          # Navigation bar
│   │   ├── 📜 wallet.js          # Wallet connection and account state
│   │   ├── 📜 support.js         # ETH support / donation logic
│   │   ├── 📜 hero.js            # Hero section and background
│   │   ├── 📜 contact.js         # Contact section
│   │   ├── 📜 footer.js          # Footer
│   │   └── 📜 utils.js           # Utilities and global interactions
│   │
│   ├── 📁 components/            # Reusable content components
│   │   ├── 📜 article.js         # Article content renderer
│   │   ├── 📜 articleList.js     # Latest articles list
│   │   └── 📜 sidebar.js         # Article database sidebar
│   │
│   ├── 📁 config/                # Configuration
│   │   ├── 📜 common.js          # Shared site configuration
│   │   └── 📁 pages/             # Page-specific configuration
│   │       ├── 📜 databar.js     # Generated article database configuration
│   │       └── 📜 home.js        # Home page configuration
│   │
│   ├── 📁 database/              # External data integration
│   │   └── 📜 appscript.js       # Google Apps Script email subscription interface
│   │
│   └── 📁 pages/                 # Page entry points
│       ├── 📜 home.js            # Entry point for index.html
│       └── 📜 article.js         # Entry point for article.html
│
└── 📖 README.md                  # Project documentation
```

## 🧩 Architecture

This project separates **configuration, shared functionality, reusable components, and page logic**.

* `core/` — Contains functionality shared across pages.
* `components/` — Contains reusable content components.
* `config/` — Stores shared and page-specific configuration.
* `database/` — Stores article HTML files organized by category. The root-level `buildDatabar.py` generates the article database configuration.
* `pages/` — Contains the entry logic for individual pages.

This structure allows new pages and content to reuse existing modules without duplicating the underlying implementation.

## 🌱 Design Philosophy

**Build from first principles.**

This project is not only a blog website, but also an exploration of **modular architecture, configuration separation, and reusable static web development**.

The goal is to remain simple, transparent, and maintainable while avoiding unnecessary abstraction.

## 📚 Article Database Workflow

The article database uses exported HTML files as its content source. Article metadata is read by `buildDatabar.py` to generate the navigation and listing configuration automatically.

### 1. Export a Jupyter Notebook to HTML

Write or maintain the original `.ipynb` notebook in your preferred location. Export it to HTML using Jupyter Notebook's export function, or run:

```bash
jupyter nbconvert --to html basics-chinese.ipynb --output basics-chinese.html
```

Only the exported HTML file needs to be added to this blog repository; the original notebook can remain in its existing location.

### 2. Place the HTML file in the database

Put the exported HTML file into the appropriate category directory:

```text
database/
├── products/
│   └── blog-website.html
├── python/
│   ├── basics-chinese.html
│   └── basics-english.html
└── topics/
    └── token-price-simulation.html
```

Each immediate subdirectory under `database/` represents a category. To create a new category, create a new subdirectory and place its HTML articles inside it.

Use lowercase filenames with hyphens between words. The filename without `.html` becomes the article ID. The category directory name determines the article's category.

For example:

* File: `database/python/basics-chinese.html`
* Article ID: `basics-chinese`
* Category: `Python`
* Display title: `Basics Chinese`

The display title is generated from the filename; it is not read from the HTML `<title>` element.

### 3. Add article metadata

Open the exported HTML file and add the following metadata inside its `<head>` section:

```html
<meta name="date" content="2026-10-11">
<meta name="url" content="article.html?article=basics-chinese">
<meta name="summary" content="A short description of this article.">
```

The three metadata fields serve different purposes:

| Field     | Purpose                                                                    |
| --------- | -------------------------------------------------------------------------- |
| `date`    | Publication date in `YYYY-MM-DD` format; used to sort the latest articles. |
| `url`     | Destination opened when the article link is clicked.                       |
| `summary` | Short description displayed in the latest articles list.                   |

**URL rules:**

* **Display the local HTML article inside the blog:** Use `article.html?article=your-article-id`. The ID must match the HTML filename without its extension.
* **Link to an external page or resource:** Use its full URL, such as a GitHub repository or notebook URL.

For example, the local article `database/python/basics-chinese.html` uses:

```html
<meta name="url" content="article.html?article=basics-chinese">
```

The article page uses the ID to locate the corresponding HTML file under its category directory. External URLs instead open the specified external resource.

Keep the metadata values synchronized with the filename and intended destination. If you rename an article, update its internal URL accordingly.

### 4. Regenerate the database configuration

Run the following command from the repository root:

```bash
python buildDatabar.py
```

The script scans the category subdirectories under `database/`, reads the metadata from each HTML file, and generates:

```text
js/config/pages/databar.js
```

The generated configuration contains the article IDs, display titles, dates, categories, URLs, and summaries. It is used by the article sidebar and latest-article listing.

**Do not edit `js/config/pages/databar.js` manually.** Update the HTML files and rerun the generator instead.

### 5. Commit the changes

After adding or updating an article:

1. Export the notebook to HTML.
2. Place the HTML file in the appropriate `database/` category directory.
3. Add or update its metadata.
4. Run `python buildDatabar.py`.
5. Commit the HTML file and regenerated `js/config/pages/databar.js`.

This keeps article content and database navigation synchronized without manually maintaining a separate article index.

## ⚙️ Configuration Map

The project separates configuration from page logic and reusable components. If you modify a configuration item, use the table below to identify the related files that may also need to be updated.

| Configuration | Config File                  | Related Files                                                                                                                     | Purpose                                                                 |
| ------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `meta`        | `js/config/common.js`        | `js/core/utils.js`, `js/core/hero.js`                                                                                             | Site title, logo, background image, site name, and home link            |
| `api`         | `js/config/common.js`        | `js/database/appscript.js`                                                                                                        | External API and Google Apps Script configuration                       |
| `navbar`      | `js/config/common.js`        | `js/core/navbar.js`                                                                                                               | Navigation buttons, slogan, and Topics menu                             |
| `wallet`      | `js/config/common.js`        | `js/core/wallet.js`                                                                                                               | Wallet connection, account state, and wallet-related messages           |
| `support`     | `js/config/common.js`        | `js/core/support.js`                                                                                                              | ETH support address, amount, network settings, and transaction messages |
| `contact`     | `js/config/common.js`        | `js/core/contact.js`, `js/database/appscript.js`                                                                                  | Contact section content and email subscription settings                 |
| `footer`      | `js/config/common.js`        | `js/core/footer.js`                                                                                                               | Footer text, columns, and links                                         |
| `socialLinks` | `js/config/common.js`        | `js/core/contact.js`                                                                                                              | Social and identity links such as ENS, X, Bluesky, and GitHub           |
| `database`    | `js/config/pages/databar.js` | `js/components/sidebar.js`, `js/components/articleList.js`, `js/components/article.js`, `js/pages/home.js`, `js/pages/article.js` | Article categories, article metadata, navigation, and rendering         |
| `home`        | `js/config/pages/home.js`    | `js/pages/home.js`                                                                                                                | Home-page-specific display settings                                     |

### Configuration Principles

* **Configuration files** define content, parameters, links, and display settings.
* **Core modules** implement shared functionality and behavior.
* **Components** render reusable content structures.
* **Page entry points** assemble configuration and modules into complete pages.
* **Article HTML files** contain article content and metadata.
* **`buildDatabar.py`** generates the article database configuration from the HTML files.
* When changing a configuration item, check the corresponding **Related Files** in the table above before modifying the configuration structure itself.

---

# 中文

## 📂 项目结构

```text
jaimo-blogs/
├── 📄 index.html                 # 首页
├── 📄 article.html               # 文章数据库页面
├── 📄 buildDatabar.py            # 文章数据库配置生成器
│
├── 📁 database/                  # 按分类存放的文章 HTML 文件
│   ├── 📁 products/              # 产品相关内容
│   ├── 📁 python/                # Python 学习笔记
│   └── 📁 topics/                # 技术主题与研究
│
├── 📁 images/                    # 静态图片
│   ├── 🖼️ avatar.png
│   └── 🖼️ background.png
│
├── 📁 js/
│   ├── 📁 core/                  # 公共核心模块
│   │   ├── 📜 navbar.js          # 导航栏
│   │   ├── 📜 wallet.js          # 钱包连接与账户状态
│   │   ├── 📜 support.js         # ETH 支持功能
│   │   ├── 📜 hero.js            # Hero 区域与背景
│   │   ├── 📜 contact.js         # 联系区域
│   │   ├── 📜 footer.js          # 页脚
│   │   └── 📜 utils.js           # 通用工具与全局交互
│   │
│   ├── 📁 components/            # 可复用内容组件
│   │   ├── 📜 article.js         # 文章内容渲染
│   │   ├── 📜 articleList.js     # 最新文章列表
│   │   └── 📜 sidebar.js         # 文章数据库侧边栏
│   │
│   ├── 📁 config/                # 配置文件
│   │   ├── 📜 common.js          # 公共配置
│   │   └── 📁 pages/             # 页面专属配置
│   │       ├── 📜 databar.js     # 自动生成的文章数据库配置
│   │       └── 📜 home.js        # 首页配置
│   │
│   ├── 📁 database/              # 外部数据交互
│   │   └── 📜 appscript.js       # Google Apps Script 邮箱订阅接口
│   │
│   └── 📁 pages/                 # 页面入口逻辑
│       ├── 📜 home.js            # index.html 的入口逻辑
│       └── 📜 article.js         # article.html 的入口逻辑
│
└── 📖 README.md                  # 项目说明
```

## 🧩 项目架构

本项目将**配置、公共功能、可复用组件与页面逻辑**进行分离。

* `core/` — 存放所有页面共享的核心功能。
* `components/` — 存放可复用的内容组件。
* `config/` — 存放公共配置与页面专属配置。
* `database/` — 按分类存放文章 HTML 文件，由根目录下的 `buildDatabar.py` 自动生成文章数据库配置。
* `pages/` — 负责各个页面的初始化与组装。

这种结构可以让新的页面和内容复用现有模块，而不需要重复实现底层逻辑。

## 🌱 设计理念

**Build from first principles.**

这个项目不仅是一个博客页面，也是一个对**模块化、配置分离与可复用静态网站架构**的实践。

尽可能保持简单、透明和可维护，同时避免不必要的复杂抽象。

## 📚 文章数据库工作流程

文章数据库以导出的 HTML 文件作为内容来源。`buildDatabar.py` 会读取 HTML 文件中的元数据，自动生成文章导航和列表所需的配置。

### 1. 将 Jupyter Notebook 导出为 HTML

在你习惯的位置编写或维护原始 `.ipynb` 文件，然后使用 Jupyter Notebook 的导出功能，或者运行：

```bash
jupyter nbconvert --to html basics-chinese.ipynb --output basics-chinese.html
```

只需要将导出的 HTML 文件加入这个博客仓库；原始 Notebook 可以继续保留在原来的位置。

### 2. 将 HTML 文件放入数据库目录

把导出的 HTML 文件放入对应的分类目录：

```text
database/
├── products/
│   └── blog-website.html
├── python/
│   ├── basics-chinese.html
│   └── basics-english.html
└── topics/
    └── token-price-simulation.html
```

`database/` 下的每个一级子目录都代表一个分类。需要新增分类时，创建一个新的子目录，再把对应的文章 HTML 文件放进去即可。

文件名统一使用小写字母，多个单词之间使用连字符 `-`。文件名去掉 `.html` 后，就是文章的唯一 ID；所在的分类目录决定文章所属的分类。

例如：

* 文件路径：`database/python/basics-chinese.html`
* 文章 ID：`basics-chinese`
* 所属分类：`Python`
* 自动生成的显示标题：`Basics Chinese`

显示标题根据文件名生成，而不是读取 HTML 中的 `<title>` 标签。

### 3. 添加文章元数据

打开导出的 HTML 文件，在 `<head>` 区域中添加以下元数据：

```html
<meta name="date" content="2026-10-11">
<meta name="url" content="article.html?article=basics-chinese">
<meta name="summary" content="这是一段简短的文章介绍。">
```

三个元数据字段分别用于：

| 字段        | 作用                              |
| --------- | ------------------------------- |
| `date`    | 文章日期，格式为 `YYYY-MM-DD`，用于最新文章排序。 |
| `url`     | 点击文章链接时打开的目标地址。                 |
| `summary` | 显示在最新文章列表中的简短介绍。                |

**URL 的填写规则：**

* **希望在博客内部展示本地 HTML 文章：** 使用 `article.html?article=文章ID`。其中的 ID 必须与 HTML 文件名去掉扩展名后的结果完全一致。
* **希望链接到外部页面或资源：** 填写完整 URL，例如 GitHub 仓库地址或 Notebook 地址。

例如，`database/python/basics-chinese.html` 对应的内部文章链接是：

```html
<meta name="url" content="article.html?article=basics-chinese">
```

文章页面会根据这个 ID，在相应的分类目录中找到并展示 HTML 文件。如果填写的是外部 URL，点击后则会打开指定的外部资源。

修改文件名时，记得同步修改内部 URL 中的文章 ID，确保文件名、ID 和链接一致。

### 4. 重新生成数据库配置

在仓库根目录下运行：

```bash
python buildDatabar.py
```

脚本会扫描 `database/` 下的分类子目录，读取每个 HTML 文件中的元数据，并自动生成：

```text
js/config/pages/databar.js
```

生成的配置包含文章 ID、显示标题、日期、分类、URL 和简介，供文章侧边栏及最新文章列表使用。

**不要手动修改 `js/config/pages/databar.js`。** 应当修改对应的 HTML 文件，然后重新运行生成器。

### 5. 提交更新

每次新增或更新文章时，按以下顺序操作：

1. 将 Notebook 导出为 HTML。
2. 把 HTML 文件放入对应的 `database/` 分类目录。
3. 添加或更新元数据。
4. 运行 `python buildDatabar.py`。
5. 提交 HTML 文件以及重新生成的 `js/config/pages/databar.js`。

这样，文章正文与数据库导航就能保持同步，无须手动维护独立的文章索引。

## ⚙️ 配置地图

本项目将配置与页面逻辑、可复用组件分离。如果需要修改某项配置，可以先通过下面的表格确认对应的配置文件，以及可能需要同步调整的关联文件。

| 配置模块          | 配置文件                         | 关联文件                                                                                                                          | 作用                             |
| ------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `meta`        | `js/config/common.js`        | `js/core/utils.js`、`js/core/hero.js`                                                                                          | 网站标题、Logo、背景图片、站点名称和首页链接       |
| `api`         | `js/config/common.js`        | `js/database/appscript.js`                                                                                                    | 外部 API 和 Google Apps Script 配置 |
| `navbar`      | `js/config/common.js`        | `js/core/navbar.js`                                                                                                           | 顶部导航按钮、Slogan 和 Topics 菜单      |
| `wallet`      | `js/config/common.js`        | `js/core/wallet.js`                                                                                                           | 钱包连接、账户状态及钱包相关提示信息             |
| `support`     | `js/config/common.js`        | `js/core/support.js`                                                                                                          | ETH 赞助地址、赞助金额、网络参数及交易提示信息      |
| `contact`     | `js/config/common.js`        | `js/core/contact.js`、`js/database/appscript.js`                                                                               | 联系区域内容及邮箱订阅配置                  |
| `footer`      | `js/config/common.js`        | `js/core/footer.js`                                                                                                           | 页脚文字、栏目和链接                     |
| `socialLinks` | `js/config/common.js`        | `js/core/contact.js`                                                                                                          | ENS、X、Bluesky、GitHub 等社交与身份链接  |
| `database`    | `js/config/pages/databar.js` | `js/components/sidebar.js`、`js/components/articleList.js`、`js/components/article.js`、`js/pages/home.js`、`js/pages/article.js` | 文章分类、文章信息、数据库导航与文章渲染           |
| `home`        | `js/config/pages/home.js`    | `js/pages/home.js`                                                                                                            | 首页专属展示配置                       |

### 配置原则

* **配置文件**负责定义内容、参数、链接和展示设置。
* **核心模块**负责实现通用功能和具体行为。
* **组件模块**负责渲染可复用的内容结构。
* **页面入口**负责将配置和各个模块组合成完整页面。
* **文章 HTML 文件**负责保存文章正文和元数据。
* **`buildDatabar.py`** 负责根据 HTML 文件生成文章数据库配置。
* 修改某项配置时，建议先查看上表中的**关联文件**，确认是否需要同步调整相关逻辑。
