// ==========================================
// 顶部背景组件 / Hero section component
// ==========================================

window.Blog = window.Blog || {};

Blog.renderHero = function(commonConfig) {
    const heroContainer = document.getElementById("hero-container");
    if(!heroContainer) return;

    // 从公共配置中获取站点信息与 Hero 文案 / Get site information and Hero content from the shared configuration
    const meta = commonConfig.meta;

    heroContainer.innerHTML = `
        <div class="relative w-full h-[420px] bg-cover bg-center flex items-center -mt-8" style="background-image: url('${meta.backgroundImage}');">
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="relative max-w-7xl mx-auto px-6 w-full">
                <div class="max-w-lg text-left">
                    <h1 class="text-4xl md:text-5xl font-extrabold text-green-900 mb-3 drop-shadow-sm">${meta.siteName}</h1>
                    <p class="text-lg md:text-xl text-green-800 font-medium drop-shadow-sm">${commonConfig.navbar.slogan}</p>
                </div>
            </div>
        </div>
    `;
};