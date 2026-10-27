// ==========================================
// 底部栏组件 / Footer component
// ==========================================

window.Blog = window.Blog || {};

Blog.renderFooter = function(commonConfig) {
    const container = document.getElementById('footer-container');
    if (!container) return;
    const footer = commonConfig.footer;

    // 根据配置中的栏目数量动态设置桌面端 Grid 列数 / Dynamically set desktop grid columns based on the configured footer columns
    const totalCols = 2 + footer.columns.length;
    let styleTag = document.getElementById('dynamic-footer-style');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-footer-style';
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
        @media (min-width: 768px) {
            .dynamic-footer-grid { grid-template-columns: repeat(${totalCols}, minmax(0, 1fr)) !important; }
        }
    `;

    container.innerHTML = `
        <footer class="bg-white border-t border-[#d8e2dc] mt-20">
            <div class="max-w-7xl mx-auto px-6 py-12">
                <div class="grid grid-cols-1 dynamic-footer-grid gap-8 items-start">
                    <div class="md:col-span-2 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg overflow-hidden bg-[#588157] flex items-center justify-center shadow-sm shrink-0">
                                <img src="${commonConfig.meta.logoImg}" alt="${Blog.escapeHtml(commonConfig.meta.siteName)}" class="w-full h-full object-cover">
                            </div>
                            <span class="font-bold text-base text-[#2b2d42]">${Blog.escapeHtml(commonConfig.meta.siteName)}</span>
                        </div>
                        <p class="text-xs text-gray-500">@${new Date().getFullYear()} ${Blog.escapeHtml(footer.copyright)}</p>
                    </div>

                    ${footer.columns.map(col => `
                        <div>
                            <h4 class="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-3">${Blog.escapeHtml(col.title)}</h4>
                            <ul class="space-y-2 text-xs text-gray-600">
                                ${col.links.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer" class="hover:text-[#588157] transition">${Blog.escapeHtml(link.name)}</a></li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-12 pt-6 border-t border-[#d8e2dc] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span class="text-xs text-gray-400">${Blog.escapeHtml(footer.tagline)}</span>
                    <div class="flex items-center gap-5 text-gray-600">
                        ${commonConfig.socialLinks.map(social => `
                            <a href="${social.url}" target="_blank" title="${social.name}" class="hover:text-[#588157] transition flex items-center justify-center w-6 h-6">
                                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">${social.svg}</svg>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        </footer>
    `;
};