// ==========================================
// 左侧数据库侧边栏组件 / Database sidebar component
// ==========================================

window.Blog = window.Blog || {};

// 渲染数据库分类及文章导航 / Render database categories and article navigation
Blog.renderSidebar = function(database) {
    return `
        <div class="space-y-6">
            <div class="text-green-800 font-bold text-xl mb-4">
                ${Blog.escapeHtml(database.title)}
            </div>
            <div class="space-y-4">
                ${database.categories.map((cat, index) => `
                    <div class="database-category">
                        <button type="button" class="database-category-toggle w-full flex items-center gap-2 text-left text-gray-900 font-semibold text-base hover:text-green-700 transition-colors" data-category="${index}">
                            <span class="database-category-symbol w-4 text-center">+</span>
                            <span>${Blog.escapeHtml(cat.name)}</span>
                        </button>
                        <div class="database-category-content hidden pl-6 space-y-1.5 border-l border-gray-100 ml-2 mt-2">
                            ${cat.articles.map(art => `
                                <div class="py-0.5">
                                    <a href="${art.url || '#'}" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-600 hover:text-green-700 transition-colors inline-block">
                                        · ${Blog.escapeHtml(art.title)}
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

// 初始化数据库分类折叠功能 / Initialize database category collapse
Blog.initSidebar = function() {
    document.querySelectorAll('.database-category-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const symbol = button.querySelector('.database-category-symbol');
            const isCollapsed = content.classList.contains('hidden');

            content.classList.toggle('hidden', !isCollapsed);
            symbol.textContent = isCollapsed ? '-' : '+';
        });
    });
};