// ==========================================
// 文章列表与多维筛选组件 / Article list & dual-filtering component
// ==========================================

window.Blog = window.Blog || {};

// 定义全局视图状态（支持分类与作者双重筛选）
window.Blog.homeState = window.Blog.homeState || {
    currentCategory: 'All',
    currentAuthor: null,  // 🟢 改为记录当前选中的作者
    currentPage: 1,
    pageSize: 15
};

Blog.initArticleList = function(database) {
    let allArticles = [];

    // 合并所有分类中的文章，并安全提取作者信息
    database.categories.forEach(cat => {
        cat.articles.forEach(art => {
            allArticles.push({ 
                ...art, 
                categoryName: cat.name, 
                categoryIcon: cat.icon || '',
                author: art.author || 'Anonymous',
                authorAvatar: art.authorAvatar || 'images/avatar.png'
            });
        });
    });

    // 默认按日期倒序排列 (Newest First)
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 收集全站所有唯一的作者信息（名字 + 头像）
    const authorMap = new Map();
    allArticles.forEach(art => {
        if (art.author) {
            authorMap.set(art.author, art.authorAvatar);
        }
    });

    // 获取页面中的 DOM 挂载点
    const pillsContainer = document.getElementById("category-pills-container");
    const titleEl = document.getElementById("current-category-title");
    const browseBtn = document.getElementById("browse-topics-btn");
    const popover = document.getElementById("topics-popover");
    const tagsContainer = document.getElementById("topics-tags-container");
    const clearTagBtn = document.getElementById("clear-tag-filter");
    const gridContainer = document.getElementById("article-grid-container");
    const paginationContainer = document.getElementById("pagination-container");

    // 修改 Browse topics 按钮的文案提示（如果需要的话，也可以保留原样）
    if (browseBtn) {
        const spanEl = browseBtn.querySelector('span');
        if (spanEl) spanEl.textContent = 'Browse authors';
    }

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

    // 渲染右上角弹窗中的作者列表
    function renderAuthorsPopover() {
        if (!tagsContainer) return;
        
        let html = '';
        authorMap.forEach((avatar, authorName) => {
            const isActive = Blog.homeState.currentAuthor === authorName;
            const activeClass = isActive
                ? "bg-green-50 border-green-500 text-green-900 shadow-xs"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";
            
            html += `
                <button class="author-pill w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer text-left ${activeClass}" data-author="${authorName}">
                    <img src="${Blog.escapeHtml(avatar)}" alt="${Blog.escapeHtml(authorName)}" class="w-8 h-8 rounded-full object-cover border border-gray-200">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-semibold truncate">${Blog.escapeHtml(authorName)}</div>
                        <div class="text-xs text-gray-400">Author</div>
                    </div>
                </button>
            `;
        });
        
        tagsContainer.innerHTML = html || '<div class="text-xs text-gray-400 p-2">No authors found</div>';

        if (clearTagBtn) {
            clearTagBtn.textContent = "Clear author";
            if (Blog.homeState.currentAuthor) {
                clearTagBtn.classList.remove('hidden');
            } else {
                clearTagBtn.classList.add('hidden');
            }
        }
    }

    // 核心渲染函数：双重筛选、排序、分页与视图更新
    function updateView() {
        // 1. 双重过滤（分类 + 作者）
        let filtered = allArticles.filter(art => {
            const matchCategory = Blog.homeState.currentCategory === 'All' || art.categoryName === Blog.homeState.currentCategory;
            const matchAuthor = !Blog.homeState.currentAuthor || art.author === Blog.homeState.currentAuthor;
            return matchCategory && matchAuthor;
        });

        // 2. 更新左侧主标题
        if (titleEl) {
            if (Blog.homeState.currentAuthor) {
                titleEl.textContent = `${Blog.homeState.currentCategory} / By ${Blog.homeState.currentAuthor}`;
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

        // 4. 渲染 3 列文章网格（左下角展示作者头像与名字）
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
                        
                        <!-- 卡片底部：左侧作者头像+名字，右侧分类/阅读链接 -->
                        <div class="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2">
                                <img src="${Blog.escapeHtml(art.authorAvatar)}" alt="${Blog.escapeHtml(art.author)}" class="w-6 h-6 rounded-full object-cover border border-gray-200">
                                <span class="font-medium text-gray-700">${Blog.escapeHtml(art.author)}</span>
                            </div>
                            <a href="${art.url || '#'}" target="_blank" rel="noopener noreferrer" class="text-green-700 font-medium hover:underline">Read →</a>
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
            Blog.homeState.currentPage = 1;
            renderPills();
            updateView();
        });
    }

    // 2. 切换 Browse authors 弹窗显示与隐藏
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

    // 3. 点击作者进行双重过滤
    if (tagsContainer) {
        tagsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.author-pill');
            if (!btn) return;
            const clickedAuthor = btn.getAttribute('data-author');
            
            if (Blog.homeState.currentAuthor === clickedAuthor) {
                Blog.homeState.currentAuthor = null; // 再次点击取消作者筛选
            } else {
                Blog.homeState.currentAuthor = clickedAuthor;
            }
            Blog.homeState.currentPage = 1;
            renderAuthorsPopover();
            updateView();
            popover.classList.add('hidden');
        });
    }

    if (clearTagBtn) {
        clearTagBtn.addEventListener('click', () => {
            Blog.homeState.currentAuthor = null;
            Blog.homeState.currentPage = 1;
            renderAuthorsPopover();
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
            gridContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // 初始化首次渲染
    renderPills();
    renderAuthorsPopover();
    updateView();
};