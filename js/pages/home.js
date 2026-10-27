// ==========================================
// 首页主逻辑入口 / Home page entry point
// ==========================================

window.Blog = window.Blog || {};

document.addEventListener("DOMContentLoaded", () => {
    if (!window.SITE_CONFIG || !window.DATABAR_CONFIG || !window.PAGE_CONFIG) {
        console.error("Configurations not found!");
        return;
    }
    
    const commonConfig = window.SITE_CONFIG;
    const databarConfig = window.DATABAR_CONFIG;
    const pageConfig = window.PAGE_CONFIG;
    
    // 合并公共数据库配置与首页专属配置 / Merge shared database configuration with home page overrides
    const mergedDatabase = {
        ...databarConfig.database,
        ...(pageConfig.database || {})
    };
    
    // 1. 初始化网页基础元信息 / Initialize basic document metadata
    Blog.initDocumentMeta(commonConfig.meta);
    
    // 2. 渲染公共页面模块 / Render shared page components
    Blog.renderNavbar();
    Blog.renderHero(commonConfig);
    
    // 3. 渲染首页主体内容 / Render the main home page content
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.innerHTML = `
            <div class="max-w-7xl mx-auto px-6 py-12">
                <div class="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_200px] gap-22 items-start">
                    <div class="lg:sticky lg:top-20 space-y-6">
                        ${Blog.renderSidebar(mergedDatabase)}
                    </div>
                    <div class="min-w-0 space-y-8">
                        ${Blog.renderLatestArticles(mergedDatabase)}
                    </div>
                    <div></div>
                </div>
            </div>
        `;
    }
    
    // 4. 渲染联系与底部模块 / Render contact and footer components
    Blog.renderContactSection(commonConfig);
    Blog.renderFooter(commonConfig);
    
    // 5. 绑定全局交互事件 / Bind global interaction events
    Blog.initSidebar();
    Blog.initGlobalEvents();

    // 6. 恢复钱包状态并监听账户变化 / Restore wallet state and listen for account changes
    Blog.tryRestoreWallet();
    Blog.bindWalletEvents();
});