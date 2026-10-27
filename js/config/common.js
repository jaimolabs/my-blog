// ==========================================
// 全局公共配置 / Global shared configuration
// ==========================================

window.SITE_CONFIG = {
    // 站点基础信息 / Basic site information
    meta: {
        title: "JaiMo Core | Blog",
        logoImg: "images/avatar.png",
        backgroundImage: "images/background.png",
        siteName: "JaiMo Blogs",
        homeLink: "https://blog.jaimo.xyz"
    },

    // 后端服务与 API 配置 / Backend services and API configuration
    api: {
        ensURL:"https://api.ensideas.com/ens/resolve/",
        googleScriptURL: "https://script.google.com/macros/s/AKfycbxxHkGniVjoZMsDe2LVOcgc1nbK9FUQ9R-zvbuI9m8tKO__tYQuxUfBxhAPoXAlaO9qUg/exec"
    },

    // 顶部导航栏配置 / Navigation bar configuration
    navbar: {
        topicsBtnText: "Topics",
        slogan: "Build from first principles.",
        topicsMenu: [
            { name: "Token Price Simulation", link: "article.html?article=token-price-simulation", type: "article" },
            { name: "✅ Verify via ENS", link: "https://app.ens.domains/jaimo.eth", type: "action" },
            { name: "💬 Contact Us", link: "#contact-container", type: "action" }
        ]
    },

    // 钱包连接配置 / Wallet connection configuration
    wallet: {
        connectBtnText: "Connect Wallet",
        messages: {
            walletNotFound: "❌ No wallet detected; please install MetaMask first.",
            connecting: "Connecting wallet...",
            connectedWithEns: "Connected: ",
            connected: "✅ Wallet connected!",
            addressNotFound: "❌ Wallet address not retrieved.",
            cancelled: "You cancelled the wallet connection.",
            failed: "❌ Connection failed, please try again.",
            accountSwitchedWithEns: "Switched to ",
            accountSwitched: "Account switched.",
            disconnected: "❌ Wallet disconnected.",
            addressCopied: "✅ Address copied!",
            copyFailed: "❌ Copy failed; please copy manually."
        }
    },

    // 支持、赞助功能配置 / Support and donation configuration
    support: {
        supportBtnText: "Support",
        walletAddress: "jaimo.eth",
        amountEth: "0.002",
        messages: {
            copySuccess: "✅ ENS Address Copied!",
            copyError: "❌ Copy failed; please copy manually.",
            walletNotFound: "❌ No wallet detected; please install MetaMask first.",
            ethersNotLoaded: "❌ Payment component failed to load; please refresh and try again.",
            preparing: "Preparing payment...",
            resolveFailed: "❌ Unable to resolve the target address.",
            transactionPending: "Transaction submitted, awaiting confirmation...",
            success: "✅ Support successful—thank you!",
            cancelled: "You cancelled the payment.",
            insufficientFunds: "❌ Insufficient balance | 0.002 ETH",
            failed: "❌ Payment failed; please try again later.",
            switchMainnet: "Please switch to the Ethereum mainnet...",
            switchMainnetFailed: "❌ Failed to switch to the mainnet; please switch manually and try again.",
            switchMainnetRequired: "❌ You need to switch to the Ethereum mainnet to make the payment."
        },
        // Ethereum Mainnet 网络参数 / Ethereum Mainnet network parameters
        network: {
            chainId: 1,
            chainIdHex: "0x1",
            chainName: "Ethereum Mainnet",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://ethereum.publicnode.com"],
            blockExplorerUrls: ["https://etherscan.io"]
        }
    },    

    // 联系区域配置 / Contact section configuration
    contact: {
        title: "Connect with us",
        subtitle: "Have questions, feedback, or want to collaborate? Reach out through our official channels.",
        messages: {
            emailInvalid: "❌ Please enter a valid email address.",
            emailSubmitting: "Submitting...",
            emailSuccess: "✅ Thank you for subscribing!",
            emailError: "❌ Something went wrong, please try again later."
        },
        cards: {
            support: {
                title: "Get Support",
                desc: "Explore documentation, GitHub repositories, and technical FAQs for self-hosted tools.",
                btnText: "💬 Help Center"
            },
            twitter: {
                title: "Follow on X",
                desc: "Stay tuned for real-time protocol updates, research notes, and community announcements.",
                btnText: "💬 Stay Connected"
            },
            newsletter: {
                title: "Sign up for research and updates",
                desc: "Get the latest technical articles and project milestones delivered directly to your inbox.",
                placeholder: "Enter Email",
                btnText: "Submit"
            }
        }
    },

    // 页脚配置 / Footer configuration
    footer: {
        copyright: "JaiMo Core. All rights reserved.",
        tagline: "Decentralized & Autonomous",
        columns: [
            {
                title: "Topics",
                links: [
                    { name: "Token Price Simulation", url: "article.html?article=token-price-simulation" }
                ]
            },
            {
                title: "Career",
                links: [
                    { name: "Coming Soon.", url: "https://github.com/jaimocore" }
                ]
            },
            {
                title: "Python",
                links: [
                    { name: "Basics - English", url: "https://github.com/jaimoeth/python/blob/main/basics-english.ipynb" },
                    { name: "Basics - Chinese", url: "https://github.com/jaimoeth/python/blob/main/basics-chinese.ipynb" }
                ]
            },
            {
                title: "Products",
                links: [
                    { name: "Blog Website", url: "https://github.com/jaimocore/blog-web" }
                ]
            }
        ]
    },

    // 社交与身份链接 / Social and identity links
    socialLinks: [
        {
            name: "ENS",
            url: "https://app.ens.domains/jaimo.eth",
            svg: '<path fill="currentColor" d="M11.725.223 5.107 11.13a.146.146 0 0 1-.237.018c-.583-.692-2.753-3.64-.067-6.327 2.45-2.452 5.572-4.2 6.73-4.804.13-.068.269.08.192.206m-.366 23.747c.132.093.295-.064.206-.2-1.478-2.251-6.392-9.744-7.07-10.869-.67-1.11-1.987-2.953-2.097-4.53-.011-.158-.228-.19-.283-.042a10 10 0 0 0-.27.85c-1.105 4.11.5 8.472 3.985 10.916zm.909-.193 6.618-10.907a.146.146 0 0 1 .237-.018c.582.692 2.753 3.64.067 6.327-2.45 2.452-5.572 4.2-6.73 4.804-.13.068-.269-.08-.192-.206M12.641.028c-.132-.093-.295.065-.206.2 1.478 2.252 6.392 9.745 7.07 10.87.67 1.109 1.987 2.952 2.097 4.53.011.157.228.19.283.041.088-.239.182-.524.27-.85 1.105-4.11-.5-8.472-3.985-10.915z"/>'
        },
        {
            name: "BlueSky",
            url: "https://bsky.app/profile/jaimo.xyz",
            svg: '<path fill="currentColor" d="M12 10.8c-1.087-2.114-4.046-6.052-7.983-8.73-2.16-1.464-3.517-1.144-4.017-.924-.656.292-.767 1.218-.767 1.838 0 1.077.585 7.18 1.133 8.356 1.049 2.27 3.447 3.013 5.568 3.272-1.77.302-3.414 1.144-3.414 3.125 0 2.215 1.93 3.033 4.295 3.033 4.706 0 6.185-3.327 6.185-5.96 0-.27-.015-.54-.035-.81.02.27.035.54.035.81 0 2.633 1.479 5.96 6.185 5.96 2.365 0 4.295-.818 4.295-3.033 0-1.981-1.644-2.823-3.414-3.125 2.121-.259 4.519-1.002 5.568-3.272.548-1.176 1.133-7.279 1.133-8.356 0-.62-.111-1.546-.767-1.838-.5-.22-1.857-.54-4.017.924-3.937 2.678-6.896 6.616-7.983 8.73z"/>'
        },
        {
            name: "X (Twitter)",
            url: "https://x.com/jaimocore",
            svg: '<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'
        },
        {
            name: "GitHub",
            url: "https://github.com/jaimocore",
            svg: '<path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>'
        }
    ]
};