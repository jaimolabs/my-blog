// ==========================================
// Support 按钮逻辑 / Support button logic
// ==========================================

window.Blog = window.Blog || {};

const supportConfig = window.SITE_CONFIG.support;
const walletAddr = supportConfig.walletAddress;
const amountEth = supportConfig.amountEth;
const network = supportConfig.network;

// 复制收款地址 / Copy the support recipient address
Blog.copyWalletAddress = function() {
    navigator.clipboard.writeText(walletAddr).then(() => {
        Blog.showToast(supportConfig.messages.copySuccess);
    }).catch(() => {
        Blog.showToast(supportConfig.messages.copyError);
    });
};

/**
 * Support 按钮统一入口 / Unified entry point for the Support button
 * - 未连接：复制收款地址 / Not connected: copy the recipient address
 * - 已连接：发起 ETH 打赏 / Connected: send an ETH support payment
 */
Blog.handleSupportClick = async function() {
    if (!Blog.wallet || !Blog.wallet.address) {
        Blog.copyWalletAddress();
        return;
    }

    await Blog.sendSupportEth();
};

/**
 * 发起 ETH 打赏 / Send an ETH support payment
 */
Blog.sendSupportEth = async function() {
    if (!Blog.hasEthereumProvider || !Blog.hasEthereumProvider()) {
        Blog.showToast(supportConfig.messages.walletNotFound);
        return;
    }

    if (typeof ethers === 'undefined') {
        Blog.showToast(supportConfig.messages.ethersNotLoaded);
        return;
    }

    try {
        Blog.showToast(supportConfig.messages.preparing);

        // 确保钱包连接到以太坊主网 / Ensure the wallet is connected to Ethereum Mainnet
        const okNetwork = await Blog.ensureMainnet();
        if (!okNetwork) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // 解析 ENS 名称为钱包地址 / Resolve the ENS name to a wallet address
        const toAddress = await provider.resolveName(walletAddr);
        if (!toAddress) {
            Blog.showToast(supportConfig.messages.resolveFailed + ' ' + walletAddr);
            return;
        }

        const tx = await signer.sendTransaction({
            to: toAddress,
            value: ethers.parseEther(amountEth)
        });

        Blog.showToast(supportConfig.messages.transactionPending);

        // 等待一个区块确认 / Wait for one block confirmation
        await tx.wait(1);

        Blog.showToast(supportConfig.messages.success);
        console.log('[Support] tx hash =', tx.hash);
    } catch (error) {
        console.error('sendSupportEth error:', error);

        // 用户拒绝交易 / User rejected the transaction
        if (error && (error.code === 4001 || error.code === 'ACTION_REJECTED')) {
            Blog.showToast(supportConfig.messages.cancelled);
            return;
        }

        // 余额不足 / Insufficient funds
        const msg = (error && error.shortMessage) || (error && error.message) || '';
        if (msg.toLowerCase().includes('insufficient funds')) {
            Blog.showToast(supportConfig.messages.insufficientFunds);
            return;
        }

        Blog.showToast(supportConfig.messages.failed);
    }
};

/**
 * 确保当前钱包连接到指定网络 / Ensure the wallet is connected to the configured network
 * 不在目标网络时尝试切换；没有该网络则尝试添加
 * Try to switch to the target network, or add it if it is not available
 */
Blog.ensureMainnet = async function() {
    try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainId = parseInt(chainIdHex, 16);

        if (chainId === network.chainId) return true;

        Blog.showToast(supportConfig.messages.switchMainnet);

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: network.chainIdHex }]
            });
            return true;
        } catch (switchError) {
            // 钱包中不存在该网络时尝试添加 / Add the network if it is not configured in the wallet
            if (switchError && switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [network]
                });
                return true;
            }

            // 用户拒绝切换网络 / User rejected the network switch
            if (switchError && (switchError.code === 4001 || switchError.code === 'ACTION_REJECTED')) {
                Blog.showToast(supportConfig.messages.switchMainnetRequired);
                return false;
            }

            throw switchError;
        }
    } catch (error) {
        console.error('ensureMainnet error:', error);
        Blog.showToast(supportConfig.messages.switchMainnetFailed);
        return false;
    }
};