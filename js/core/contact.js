// ==========================================
// 联系我们组件 / Contact section component
// ==========================================

window.Blog = window.Blog || {};

// 渲染联系我们区域 / Render the contact section
Blog.renderContactSection = function(commonConfig) {
    const container = document.getElementById('contact-container');
    if (!container) return;

    const contact = commonConfig.contact;
    const socialLinks = commonConfig.socialLinks;

    // 根据名称匹配社交链接 / Find a social link by its name
    const getUrl = (name) => {
        const item = socialLinks.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
        return item ? item.url : '#';
    };

    container.innerHTML = `
        <div class="max-w-3xl mb-6">
            <h2 class="text-3xl font-bold tracking-tight text-[#2b2d42]">${contact.title}</h2>
            <p class="text-gray-600 mt-2 text-base">${Blog.escapeHtml(contact.subtitle)}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white border border-[#d8e2dc] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-bold text-[#588157]">${Blog.escapeHtml(contact.cards.support.title)}</h3>
                    <p class="text-sm text-gray-600 mt-2">${Blog.escapeHtml(contact.cards.support.desc)}</p>
                </div>
                <div class="mt-8">
                    <a href="${getUrl('GitHub')}" target="_blank" class="inline-block bg-[#f4f7f4] border border-[#d8e2dc] text-[#2b2d42] text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#d8e2dc] transition">
                        ${Blog.escapeHtml(contact.cards.support.btnText)}
                    </a>
                </div>
            </div>

            <div class="bg-white border border-[#d8e2dc] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-bold text-[#2b2d42]">${Blog.escapeHtml(contact.cards.twitter.title)}</h3>
                    <p class="text-sm text-gray-600 mt-2">${Blog.escapeHtml(contact.cards.twitter.desc)}</p>
                </div>
                <div class="mt-8">
                    <a href="${getUrl('X')}" target="_blank" class="inline-block bg-[#f4f7f4] border border-[#d8e2dc] text-[#2b2d42] text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#d8e2dc] transition">
                        ${Blog.escapeHtml(contact.cards.twitter.btnText)}
                    </a>
                </div>
            </div>

            <div class="bg-white border border-[#d8e2dc] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-bold text-[#588157]">${Blog.escapeHtml(contact.cards.newsletter.title)}</h3>
                    <p class="text-sm text-gray-600 mt-2">${Blog.escapeHtml(contact.cards.newsletter.desc)}</p>
                </div>
                <div class="mt-6 flex gap-2">
                    <input type="email" id="subscriber-email" placeholder="${Blog.escapeHtml(contact.cards.newsletter.placeholder)}" class="bg-[#f4f7f4] border border-[#d8e2dc] text-xs rounded-xl px-3 py-2.5 w-full focus:outline-none focus:border-[#588157]">
                    <!-- 调用 appscript.js 中的订阅函数 / Call the subscription function from appscript.js -->
                    <button onclick="Blog.subscribeEmailToSheet()" id="submit-btn" class="bg-[#588157] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#3a5a40] transition cursor-pointer shrink-0">
                        ${Blog.escapeHtml(contact.cards.newsletter.btnText)}
                    </button>
                </div>
            </div>
        </div>
    `;
};