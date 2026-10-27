// ==========================================
// 顶部导航栏组件 / Top navigation bar component
// ==========================================

window.Blog = window.Blog || {};

const commonConfig = window.SITE_CONFIG;

Blog.renderNavbar = function() {
    const container = document.getElementById('navbar-container');
    if (!container) return;
    
    // 获取导航配置并按类型拆分菜单项 / Load navigation configuration and separate menu items by type
    const navbarConfig = commonConfig.navbar;
    const menuItems = navbarConfig.topicsMenu || [];
    const contentItems = menuItems.filter(item => item.type !== 'action');
    const actionItems = menuItems.filter(item => item.type === 'action');

    // 根据菜单项配置生成下拉菜单内容 / Generate dropdown menu items from configuration
    const renderDropdownItem = (item) => {
        const openInNewTab = item.link.startsWith('http') || item.type === 'article';
        const targetAttr = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        const externalIcon = openInNewTab 
            ? `<span class="text-[10px] text-gray-400 opacity-70 ml-2 group-hover:text-[#588157] transition-colors">↗</span>` 
            : '';
        
        return `
            <a href="${item.link}"${targetAttr} 
            class="group flex items-center justify-between px-3 py-2.5 mx-2 my-1 text-sm text-[#2b2d42] bg-transparent hover:bg-[#f4f7f4] rounded-lg transition-all duration-200 cursor-pointer">
                <span class="font-medium group-hover:text-[#588157] transition-colors">${item.name}</span>
                ${externalIcon}
            </a>
        `;
    };

    container.innerHTML = `
        <header class="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-[#d8e2dc] px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <a href="${commonConfig.meta.homeLink}" class="flex items-center gap-3 group">
                    <div class="w-9 h-9 rounded-lg overflow-hidden bg-[#588157] flex items-center justify-center shadow-sm shrink-0">
                        <img src="${commonConfig.meta.logoImg}" alt="${commonConfig.meta.siteName}" class="w-full h-full object-cover">
                    </div>
                    <span class="font-bold text-lg tracking-tight text-[#2b2d42]">${commonConfig.meta.siteName}</span>
                </a>

                <div class="relative">
                    <button id="topicsBtn" onclick="Blog.toggleTopicsMenu()" class="text-xs font-medium px-3.5 py-2 rounded-lg border border-[#d8e2dc] text-[#2b2d42] hover:bg-[#f4f7f4] transition flex items-center gap-1.5 cursor-pointer shadow-sm">
                        ${navbarConfig.topicsBtnText} <span class="text-[10px]">▾</span>
                    </button>
                    
                    <div id="topicsDropdown" class="hidden absolute left-0 mt-2 w-56 bg-white border border-[#d8e2dc] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-2 z-50">
                        <div class="flex flex-col">
                            ${contentItems.map(renderDropdownItem).join('')}
                        </div>
                        ${actionItems.length > 0 ? `
                            <div class="h-px bg-[#d8e2dc] my-1.5 mx-4 opacity-60"></div>
                            <div class="flex flex-col">
                                ${actionItems.map(renderDropdownItem).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="hidden md:block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                ${navbarConfig.slogan}
            </div>

            <div class="flex items-center gap-3">
                <button onclick="Blog.handleSupportClick()" class="text-xs font-medium px-3.5 py-2 rounded-lg border border-[#588157] text-[#588157] hover:bg-[#588157] hover:text-white transition cursor-pointer">
                    ${commonConfig.support.supportBtnText}
                </button>
                <button
                    id="connect-wallet-btn"
                    onclick="Blog.handleWalletButtonClick()"
                    class="text-xs font-medium px-4 py-2 rounded-lg bg-[#588157] text-white hover:bg-[#3a5a40] shadow-sm transition cursor-pointer"
                >
                    ${commonConfig.wallet.connectBtnText}
                </button>
            </div>
        </header>
    `;
};