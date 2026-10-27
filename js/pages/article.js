// ==========================================
// 文章页主逻辑入口 / Article page entry point
// ==========================================

window.Blog = window.Blog || {};

document.addEventListener("DOMContentLoaded", () => {
    if (!window.SITE_CONFIG || !window.DATABAR_CONFIG) {
        console.error("Configurations not found!");
        return;
    }
    
    const commonConfig = window.SITE_CONFIG;
    const database = window.DATABAR_CONFIG.database;
    
    // 1. 初始化网页基础元信息 / Initialize basic document metadata
    Blog.initDocumentMeta(commonConfig.meta);
    
    // 2. 渲染公共页面模块 / Render shared page components
    Blog.renderNavbar();
    Blog.renderHero(commonConfig);
    
    // 3. 渲染文章页面主体 / Render article page content
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.innerHTML = `
            <div class="max-w-7xl mx-auto px-6 py-12">
                <div class="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_200px] gap-2 items-start">
                    <div class="lg:sticky lg:top-20 space-y-6">
                        ${Blog.renderSidebar(database)}
                    </div>
                    <div id="article-container" class="min-w-0 space-y-8">
                    </div>
                </div>
            </div>
        `;
        Blog.renderArticle(database);
    }
    
    // 4. 渲染联系与底部模块 / Render contact and footer components
    Blog.renderContactSection(commonConfig);
    Blog.renderFooter(commonConfig);
    
    // 5. 绑定全局交互事件 / Bind global interaction events
    Blog.initSidebar();
    Blog.initGlobalEvents();

    // 6. 恢复钱包状态并监听账户变化 / Restore wallet state and listen for wallet events
    Blog.tryRestoreWallet();
    Blog.bindWalletEvents();
});