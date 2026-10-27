// ==========================================
// 首页主逻辑入口 / Home page entry point
// ==========================================

window.Blog = window.Blog || {};

// 定义全局视图状态
window.Blog.homeState = {
    currentCategory: 'All',
    currentTag: null,
    currentPage: 1,
    pageSize: 15
};

document.addEventListener("DOMContentLoaded", () => {
    if (!window.SITE_CONFIG || !window.DATABAR_CONFIG || !window.PAGE_CONFIG) {
        console.error("Configurations not found!");
        return;
    }
    
    const commonConfig = window.SITE_CONFIG;
    const databarConfig = window.DATABAR_CONFIG;
    const pageConfig = window.PAGE_CONFIG;
    
    // 合并公共数据库配置与首页专属配置
    const mergedDatabase = {
        ...databarConfig.database,
        ...(pageConfig.database || {})
    };
    
    // 1. 初始化网页基础元信息
    Blog.initDocumentMeta(commonConfig.meta);
    
    // 2. 渲染公共页面模块
    Blog.renderNavbar();
    Blog.renderHero(commonConfig);
    
    // 3. 渲染首页主体内容容器（顶部胶囊栏 + 标题/标签按钮 + 3列网格 + 右下角翻页）
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.innerHTML = `
            <div class="max-w-7xl mx-auto px-6 py-12 space-y-8">
                <!-- 顶部水平胶囊分类栏 / Horizontal Category Pills Bar -->
                <div id="category-pills-container" class="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-200">
                    <!-- 动态注入分类胶囊 -->
                </div>

                <!-- 主标题行：左侧大字分类标题 + 右侧 Browse topics 按钮 -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
                    <!-- 左侧大字带竖条标题 -->
                    <div class="flex items-center gap-3">
                        <div class="w-1.5 h-8 bg-[#588157] rounded-full"></div>
                        <h1 id="current-category-title" class="text-3xl font-bold tracking-tight text-gray-900">All Articles</h1>
                    </div>

                    <!-- 右侧 Browse topics 标签按钮与下拉弹窗 -->
                    <div class="relative">
                        <button id="browse-topics-btn" class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all cursor-pointer">
                            <span>Browse topics</span>
                            <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        <!-- 浮动标签索引面板 (Popover) -->
                        <div id="topics-popover" class="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 hidden z-40">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">All Tags</span>
                                <button id="clear-tag-filter" class="text-xs text-green-700 hover:underline hidden cursor-pointer">Clear filter</button>
                            </div>
                            <div id="topics-tags-container" class="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
                                <!-- 动态注入所有标签 -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 文章三列网格容器 (每页固定展示 15 篇，即 5 行 × 3 列) -->
                <div id="article-grid-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- 动态渲染文章卡片 -->
                </div>

                <!-- 底部区域：右下角翻页组件 -->
                <div class="flex justify-end pt-6">
                    <div id="pagination-container" class="flex items-center gap-2">
                        <!-- 动态渲染翻页按钮 -->
                    </div>
                </div>
            </div>
        `;
    }
    
    // 4. 渲染联系与底部模块
    Blog.renderContactSection(commonConfig);
    Blog.renderFooter(commonConfig);
    
    // 5. 初始化文章网格与交互逻辑
    if (typeof Blog.initArticleList === "function") {
        Blog.initArticleList(mergedDatabase);
    }
    
    Blog.initGlobalEvents();

    // 6. 恢复钱包状态并监听账户变化
    Blog.tryRestoreWallet();
    Blog.bindWalletEvents();
});