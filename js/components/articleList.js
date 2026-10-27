// ==========================================
// 文章列表与交互组件 / Article list & interaction component
// ==========================================

window.Blog = window.Blog || {};

// 重构后的文章列表渲染与分页控制器
Blog.initArticleList = function(database) {
    let allArticles = [];

    // 合并所有分类中的文章，并附加分类信息
    database.categories.forEach(cat => {
        cat.articles.forEach(art => {
            allArticles.push({ 
                ...art, 
                categoryName: cat.name, 
                categoryIcon: cat.icon || '' 
            });
        });
    });

    // 默认按日期倒序排列 (Newest First)
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 收集全站所有唯一的标签 (Tags)
    const tagSet = new Set();
    allArticles.forEach(art => {
        if (art.tag) tagSet.add(art.tag);
    });
    const allTags = Array.from(tagSet);

    // 获取页面中的 DOM 挂载点
    const pillsContainer = document.getElementById("category-pills-container");
    const titleEl = document.getElementById("current-category-title");
    const browseBtn = document.getElementById("browse-topics-btn");
    const popover = document.getElementById("topics-popover");
    const tagsContainer = document.getElementById("topics-tags-container");
    const clearTagBtn = document.getElementById("clear-tag-filter");
    const gridContainer = document.getElementById("article-grid-container");
    const paginationContainer = document.getElementById("pagination-container");

    // 渲染顶部胶囊分类栏
    const categories = ["All", ...database.categories.map(c => c.name)];
    
    function renderPills() {
        if (!pillsContainer) return;
        pillsContainer.innerHTML = categories.map(catName => {
            const isActive = Blog.homeState.currentCategory === catName;
            const activeClass = isActive 
                ? "bg-[#588157] text-white shadow-sm font-semibold" 
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-medium";
            return `
                <button class="category-pill px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${activeClass}" data-category="${catName}">
                    ${catName}
                </button>
            `;
        }).join('');
    }

    // 渲染标签弹窗内容
    function renderTags() {
        if (!tagsContainer) return;
        tagsContainer.innerHTML = allTags.map(tag => {
            const isActive = Blog.homeState.currentTag === tag;
            const activeClass = isActive
                ? "bg-[#588157] text-white font-semibold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200";
            return `
                <button class="tag-pill px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${activeClass}" data-tag="${tag}">
                    ${Blog.escapeHtml(tag)}
                </button>
            `;
        }).join('');

        if (clearTagBtn) {
            if (Blog.homeState.currentTag) {
                clearTagBtn.classList.remove('hidden');
            } else {
                clearTagBtn.classList.add('hidden');
            }
        }
    }

    // 核心渲染函数：根据状态过滤、排序、分页并输出视图
    function updateView() {
        // 1. 组合过滤（分类 + 标签）
        let filtered = allArticles.filter(art => {
            const matchCategory = Blog.homeState.currentCategory === 'All' || art.categoryName === Blog.homeState.currentCategory;
            const matchTag = !Blog.homeState.currentTag || art.tag === Blog.homeState.currentTag;
            return matchCategory && matchTag;
        });

        // 2. 更新左侧主标题
        if (titleEl) {
            if (Blog.homeState.currentTag) {
                titleEl.textContent = `${Blog.homeState.currentCategory} / #${Blog.homeState.currentTag}`;
            } else {
                titleEl.textContent = Blog.homeState.currentCategory === 'All' ? 'All Articles' : Blog.homeState.currentCategory;
            }
        }

        // 3. 计算客户端分页（每页 15 篇，即 5 行 × 3 列）
        const pageSize = Blog.homeState.pageSize;
        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        if (Blog.homeState.currentPage > totalPages) Blog.homeState.currentPage = totalPages;
        if (Blog.homeState.currentPage < 1) Blog.homeState.currentPage = 1;

        const startIndex = (Blog.homeState.currentPage - 1) * pageSize;
        const pageArticles = filtered.slice(startIndex, startIndex + pageSize);

        // 4. 渲染 3 列文章网格
        if (gridContainer) {
            if (pageArticles.length === 0) {
                gridContainer.innerHTML = `
                    <div class="col-span-full py-20 text-center text-gray-500 text-sm">
                        No articles found matching your criteria.
                    </div>
                `;
            } else {
                gridContainer.innerHTML = pageArticles.map(art => `
                    <div class="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <span class="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md">
                                    ${Blog.escapeHtml(art.tag || art.categoryName)}
                                </span>
                                <span class="text-xs text-gray-400">${Blog.escapeHtml(art.date)}</span>
                            </div>
                            <h3 class="text-lg font-bold text-gray-900 mb-2 leading-snug">
                                <a href="${art.url || '#'}" target="_blank" rel="noopener noreferrer" class="hover:text-green-700 transition-colors">
                                    ${Blog.escapeHtml(art.title)}
                                </a>
                            </h3>
                            <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">${Blog.escapeHtml(art.summary)}</p>
                        </div>
                        <div class="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                            <span class="flex items-center gap-1">📁 ${Blog.escapeHtml(art.categoryName)}</span>
                            <a href="${art.url || '#'}" target="_blank" rel="noopener noreferrer" class="text-green-700 font-medium hover:underline">Read article →</a>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 5. 渲染右下角翻页控件
        if (paginationContainer) {
            if (totalPages <= 1) {
                paginationContainer.innerHTML = '';
                return;
            }

            let paginationHTML = `
                <button class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                    data-page="${Blog.homeState.currentPage - 1}" ${Blog.homeState.currentPage === 1 ? 'disabled' : ''}>
                    Prev
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                const isCurrent = i === Blog.homeState.currentPage;
                paginationHTML += `
                    <button class="w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${isCurrent ? 'bg-[#588157] text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}" 
                        data-page="${i}">
                        ${i}
                    </button>
                `;
            }

            paginationHTML += `
                <button class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                    data-page="${Blog.homeState.currentPage + 1}" ${Blog.homeState.currentPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
            `;

            paginationContainer.innerHTML = paginationHTML;
        }
    }

    // --- 事件绑定区 ---

    // 1. 点击顶部胶囊分类
    if (pillsContainer) {
        pillsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.category-pill');
            if (!btn) return;
            Blog.homeState.currentCategory = btn.getAttribute('data-category');
            Blog.homeState.currentPage = 1; // 切换分类重置到第一页
            renderPills();
            updateView();
        });
    }

    // 2. 切换 Browse topics 标签弹窗显示与隐藏
    if (browseBtn && popover) {
        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popover.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!popover.contains(e.target) && !browseBtn.contains(e.target)) {
                popover.classList.add('hidden');
            }
        });
    }

    // 3. 点击标签进行过滤
    if (tagsContainer) {
        tagsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.tag-pill');
            if (!btn) return;
            const clickedTag = btn.getAttribute('data-tag');
            if (Blog.homeState.currentTag === clickedTag) {
                Blog.homeState.currentTag = null; // 再次点击取消过滤
            } else {
                Blog.homeState.currentTag = clickedTag;
            }
            Blog.homeState.currentPage = 1;
            renderTags();
            updateView();
            popover.classList.add('hidden');
        });
    }

    if (clearTagBtn) {
        clearTagBtn.addEventListener('click', () => {
            Blog.homeState.currentTag = null;
            Blog.homeState.currentPage = 1;
            renderTags();
            updateView();
        });
    }

    // 4. 点击翻页按钮
    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-page]');
            if (!btn || btn.disabled) return;
            const targetPage = parseInt(btn.getAttribute('data-page'));
            Blog.homeState.currentPage = targetPage;
            updateView();
            // 滚动回网格区域顶部，带来流畅体验
            gridContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // 初始化首次渲染
    renderPills();
    renderTags();
    updateView();
};