// ==========================================
// 钱包连接 / Wallet connection
// ==========================================

window.Blog = window.Blog || {};

const ensURL = window.SITE_CONFIG.api.ensURL;
const wallet = window.SITE_CONFIG.wallet;

Blog.wallet = {
    address: null,
    ensName: null,
    isConnecting: false
};

/**
 * 缩短钱包地址 / Shorten a wallet address
 * 例如：0x1234...abcd / Example: 0x1234...abcd
 */
Blog.shortenAddress = function(address) {
    if (!address || address.length < 10) return address;
    return address.slice(0, 6) + '...' + address.slice(-4);
};

/**
 * 检查浏览器是否提供 Ethereum Provider / Check whether an Ethereum provider is available
 */
Blog.hasEthereumProvider = function() {
    return typeof window.ethereum !== 'undefined' && window.ethereum;
};

/**
 * 更新导航栏按钮文案 / Update the wallet button label
 * 优先显示 ENS，没有则显示短地址 / Prefer the ENS name, otherwise show the shortened address
 */
Blog.updateWalletButton = function() {
    const btn = document.getElementById('connect-wallet-btn');
    if (!btn) return;

    if (Blog.wallet.address) {
        const display = Blog.wallet.ensName
            ? Blog.wallet.ensName
            : Blog.shortenAddress(Blog.wallet.address);

        btn.innerText = display;
        btn.title = Blog.wallet.address; // 鼠标悬停查看完整地址 / Show the full address on hover
        btn.classList.add('is-connected');
    } else {
        btn.innerText = wallet.connectBtnText;
        btn.title = '';
        btn.classList.remove('is-connected');
    }
};

/**
 * 反向解析 ENS：地址 -> 域名 / Reverse resolve ENS: address -> name
 * 成功返回 ENS 名称，失败或不存在则返回 null
 * Returns the ENS name on success, otherwise null
 */
Blog.resolveEnsName = async function(address) {
    if (!address) return null;

    try {
        // 使用公共 ENS 解析接口获取主域名 / Use the public ENS resolver API to retrieve the primary name
        const res = await fetch(ensURL + address);
        if (!res.ok) {
            console.warn('[ENS-API] http error', res.status);
            return null;
        }

        const data = await res.json();
        console.log('[ENS-API] data =', data);

        // 兼容不同返回字段 / Support multiple possible response fields
        const name = data.name || data.reverseRecordName || data.displayName || null;

        if (!name) return null;

        // 简单确认返回值具有域名结构 / Perform a basic domain-format check
        if (typeof name === 'string' && name.includes('.')) {
            return name;
        }
        return null;
    } catch (error) {
        console.warn('ENS resolve failed:', error);
        return null;
    }
};

/**
 * 设置当前钱包地址，并尝试解析 ENS
 * Set the current wallet address and attempt ENS resolution
 */
Blog.setWalletAccount = async function(address) {
    Blog.wallet.address = address || null;
    Blog.wallet.ensName = null;

    // 先显示短地址，避免等待 ENS 解析时按钮为空
    // Show the shortened address immediately instead of waiting for ENS resolution
    Blog.updateWalletButton();

    if (!address) return;

    const ensName = await Blog.resolveEnsName(address);

    // 防止异步解析完成时账户已经发生切换或断开
    // Prevent stale ENS results after the account has changed or disconnected
    if (Blog.wallet.address && Blog.wallet.address.toLowerCase() === address.toLowerCase()) {
        Blog.wallet.ensName = ensName;
        Blog.updateWalletButton();
    }
};

/**
 * 请求连接钱包 / Request wallet connection
 */
Blog.connectWallet = async function() {
    if (Blog.wallet.isConnecting) return;

    if (!Blog.hasEthereumProvider()) {
        Blog.showToast(wallet.messages.walletNotFound);
        return;
    }

    try {
        Blog.wallet.isConnecting = true;
        Blog.showToast(wallet.messages.connecting);

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        if (accounts && accounts.length > 0) {
            await Blog.setWalletAccount(accounts[0]);
            if (Blog.wallet.ensName) {
                Blog.showToast(wallet.messages.connectedWithEns + Blog.wallet.ensName);
            } else {
                Blog.showToast(wallet.messages.connected);
            }
        } else {
            Blog.showToast(wallet.messages.addressNotFound);
        }
    } catch (error) {
        console.error('connectWallet error:', error);

        // 用户拒绝连接 / User rejected the connection request
        if (error && (error.code === 4001 || error.code === 'ACTION_REJECTED')) {
            Blog.showToast(wallet.messages.cancelled);
        } else {
            Blog.showToast(wallet.messages.failed);
        }
    } finally {
        Blog.wallet.isConnecting = false;
    }
};

/**
 * 页面加载时恢复已连接账户，不主动弹出钱包请求
 * Restore an existing wallet connection on page load without prompting the user
 */
Blog.tryRestoreWallet = async function() {
    if (!Blog.hasEthereumProvider()) return;

    try {
        const accounts = await window.ethereum.request({
            method: 'eth_accounts'
        });

        if (accounts && accounts.length > 0) {
            await Blog.setWalletAccount(accounts[0]);
        }
    } catch (error) {
        console.error('tryRestoreWallet error:', error);
    }
};

/**
 * 监听账户切换与断开 / Listen for account changes and disconnection
 */
Blog.bindWalletEvents = function() {
    if (!Blog.hasEthereumProvider()) return;

    window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts && accounts.length > 0) {
            await Blog.setWalletAccount(accounts[0]);
            Blog.showToast(Blog.wallet.ensName ? (wallet.messages.accountSwitchedWithEns + Blog.wallet.ensName) : wallet.messages.accountSwitched);
        } else {
            await Blog.setWalletAccount(null);
            Blog.showToast(wallet.messages.disconnected);
        }
    });
};

/**
 * 钱包按钮统一入口 / Unified entry point for the wallet button
 * - 未连接：连接钱包 / Not connected: connect wallet
 * - 已连接：复制当前地址 / Connected: copy the current address
 */
Blog.handleWalletButtonClick = async function() {
    if (Blog.wallet.address) {
        try {
            await navigator.clipboard.writeText(Blog.wallet.address);
            Blog.showToast(wallet.messages.addressCopied);
        } catch (e) {
            Blog.showToast(wallet.messages.copyFailed);
        }
        return;
    }

    await Blog.connectWallet();
};