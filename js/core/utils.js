// ==========================================
// 工具与全局交互 / Utilities and global interactions
// ==========================================

window.Blog = window.Blog || {};

/**
 * 简单转义 HTML，防止 XSS / Escape HTML characters to prevent XSS
 */
Blog.escapeHtml = function(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

// 初始化页面标题与 favicon / Initialize the page title and favicon
Blog.initDocumentMeta = function(meta) {
    document.title = meta.title;
    const faviconLink = document.getElementById('favicon');
    if (faviconLink && meta.logoImg) {
        faviconLink.href = meta.logoImg;
    }
};

// 切换 Topics 下拉菜单 / Toggle the Topics dropdown menu
Blog.toggleTopicsMenu = function() {
    const menu = document.getElementById('topicsDropdown');
    if (menu) menu.classList.toggle('hidden');
};

// 注册全局点击事件，点击菜单外部时自动关闭 / Register a global click handler to close the menu when clicking outside
Blog.initGlobalEvents = function() {
    window.addEventListener('click', function(e) {
        const btn = document.getElementById('topicsBtn');
        const menu = document.getElementById('topicsDropdown');
        if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });
}

/**
 * 显示全局 Toast 提示 / Show a global Toast notification
 * @param {string} message 要显示的文字 / Message to display
 * @param {number} duration 显示多久（毫秒），默认 2500 / Display duration in milliseconds, default 2500
 */
Blog.showToast = function(message, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.innerHTML = `<span>${message}</span>`;
    toast.classList.remove('translate-y-20', 'opacity-0');

    // 清除上一次计时器，避免连续触发导致状态冲突 / Clear the previous timer to prevent overlapping timeouts
    if (toast._timer) clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, duration);
};