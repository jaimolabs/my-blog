// ==========================================
// 文章组件 / Article component
// ==========================================

window.Blog = window.Blog || {};

Blog.renderArticle = function(database) {
    const container = document.getElementById("article-container");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get("article");

    if (!articleId) {
        container.innerHTML = `<div class="text-center py-20 text-gray-500">Article not found.</div>`;
        return;
    }

    const article = Blog.findArticle(database, articleId);

    if (!article) {
        container.innerHTML = `<div class="text-center py-20 text-gray-500">Article not found.</div>`;
        return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = Blog.getArticlePath(article);
    iframe.className = "w-full border-0 block";
    iframe.title = article.title;
    iframe.setAttribute("scrolling", "no");

    container.innerHTML = "";
    container.appendChild(iframe);

    iframe.addEventListener("load", () => {
        Blog.prepareArticleLinks(iframe);
        Blog.resizeArticleFrame(iframe);
    });
};

Blog.findArticle = function(database, articleId) {
    for (const category of database.categories || []) {
        for (const article of category.articles || []) {
            if (article.id === articleId) {
                return { ...article, category: category.name.toLowerCase() };
            }
        }
    }

    return null;
};

Blog.getArticlePath = function(article) {
    return `database/${article.category}/${article.id}.html`;
};

Blog.resizeArticleFrame = function(iframe) {
    try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const body = doc.body;
        const html = doc.documentElement;

        const updateHeight = () => {
            const height = Math.max(
                body?.scrollHeight || 0,
                body?.offsetHeight || 0,
                html?.scrollHeight || 0,
                html?.offsetHeight || 0
            );

            iframe.style.height = `${height}px`;
            return height;
        };

        let lastHeight = 0;
        let stableCount = 0;

        const checkHeight = () => {
            const height = updateHeight();

            if (height === lastHeight) {
                stableCount++;
            } else {
                stableCount = 0;
                lastHeight = height;
            }

            if (stableCount < 3) {
                requestAnimationFrame(checkHeight);
            }
        };

        checkHeight();

    } catch (error) {
        console.warn("Unable to resize article iframe:", error);
    }
};

Blog.prepareArticleLinks = function(iframe) {
    try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        doc.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute("href");
            if (!href) return;

            if (href.startsWith("http://") || href.startsWith("https://")) {
                link.target = "_blank";
                link.rel = "noopener noreferrer";
            }
        });
    } catch (error) {
        console.warn("Unable to prepare article links:", error);
    }
};