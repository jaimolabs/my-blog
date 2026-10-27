// ==========================================
// 右侧文章流组件 / Latest articles component
// ==========================================

window.Blog = window.Blog || {};

// 渲染最新文章列表 / Render the latest article list
Blog.renderLatestArticles = function(database) {
    let allArticles = [];

    // 合并所有分类中的文章，并附加分类信息 / Flatten articles from all categories and attach category metadata
    database.categories.forEach(cat => {
        cat.articles.forEach(art => {
            allArticles.push({ ...art, categoryName: cat.name, categoryIcon: cat.icon });
        });
    });

    // 按日期倒序排列，并获取指定数量的最新文章
    // Sort by date in descending order and keep the configured number of latest articles
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestArticles = allArticles.slice(0, database.latestCount);

    return `
        <div class="space-y-8">
            <div class="flex items-center space-x-2 text-green-800 font-bold text-xl mb-2">
                <span>${database.latestIcon}</span>
                <span>${database.latestTitle}</span>
            </div>

            <div class="space-y-6">
                ${latestArticles.map(art => `
                    <div class="bg-white border border-gray-200/80 rounded-xl p-6 shadow-xs">
                        <div class="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md mb-3">
                            ${Blog.escapeHtml(art.tag)}
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-1">
                            <a href="${art.url || '#'}" target="_blank" rel="noopener noreferrer" class="hover:text-green-700 transition-colors">
                                ${Blog.escapeHtml(art.title)}
                            </a>
                        </h3>
                        <div class="text-xs text-gray-400 mb-3">${Blog.escapeHtml(art.date)}</div>
                        <p class="text-gray-600 text-sm leading-relaxed">${Blog.escapeHtml(art.summary)}</p>
                    </div>
                `).join('')}
            </div>

            <div class="text-center pt-4 text-sm text-gray-500">
                Showing ${latestArticles.length} latest updates. Explore all topics in the <span class="font-semibold text-gray-700">${Blog.escapeHtml(database.title)}</span> on the left.
            </div>
        </div>
    `;
};