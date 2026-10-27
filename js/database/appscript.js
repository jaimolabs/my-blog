// ==========================================
// 邮箱订阅与 Google Apps Script 交互 / Email subscription and Google Apps Script integration
// ==========================================

window.Blog = window.Blog || {};

// 验证邮箱域名是否存在有效的 DNS 记录 / Validate whether the email domain has valid DNS records
Blog.validateEmailDomain = async function(domain) {
    const queryDNS = async (type) => {
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, {
            headers: { 'Accept': 'application/dns-json' }
        });
        if (!response.ok) return false;
        const data = await response.json();
        return Array.isArray(data.Answer) && data.Answer.some(record => record.type === ({ MX: 15, A: 1, AAAA: 28 }[type]));
    };

    try {
        if (await queryDNS('MX')) return true;
        return await queryDNS('A') || await queryDNS('AAAA');
    } catch (error) {
        console.error('Error validating email domain!', error);
        return false;
    }
};

// 验证邮箱并提交至 Google Apps Script / Validate the email and submit it to Google Apps Script
Blog.subscribeEmailToSheet = async function() {
    const config = window.SITE_CONFIG;
    const contactConfig = config.contact;
    const emailInput = document.getElementById('subscriber-email');
    const submitBtn = document.getElementById('submit-btn');

    if (!emailInput || !submitBtn) return;

    const email = emailInput.value.trim();

    // 基础邮箱格式检查 / Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        Blog.showToast(contactConfig.messages.emailInvalid);
        return;
    }

    const domain = email.split('@').pop().toLowerCase();
    const originalText = submitBtn.innerText;
    submitBtn.innerText = contactConfig.messages.emailSubmitting;
    submitBtn.disabled = true;

    // 检查邮箱域名是否真实存在 / Check whether the email domain actually exists
    if (!await Blog.validateEmailDomain(domain)) {
        Blog.showToast(contactConfig.messages.emailInvalid);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        return;
    }

    const scriptURL = config.api && config.api.googleScriptURL;
    if (!scriptURL) {
        console.error("Google Apps Script URL not configured!");
        Blog.showToast(contactConfig.messages.emailError);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        return;
    }

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    })
    .then(() => {
        Blog.showToast(contactConfig.messages.emailSuccess);
        emailInput.value = '';
    })
    .catch(error => {
        console.error('Error submitting email!', error);
        Blog.showToast(contactConfig.messages.emailError);
    })
    .finally(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    });
};