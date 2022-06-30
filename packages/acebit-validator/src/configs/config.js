require('dotenv')


export const config = {
    discordURLs: {
        development: "https://discord.com/api/oauth2/authorize?client_id=964527215175938060&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code&scope=identify%20guilds%20email%20guilds.members.read",
        production: "https://discord.com/api/oauth2/authorize?client_id=992115571770523708&redirect_uri=https%3A%2F%2Fwhitelist.acebit.casino%2Fcallback&response_type=code&scope=guilds.members.read%20email%20guilds"
    },
    discordServer: "952915415078694972",
    discordPermissions: "guilds.members.read identify email guilds",
    roles: {
        "952917940498489416": "Marshals",
        "955458512270553088": "Marshal Deputy",
        "952918169452961822": "Aces",
        "952918122619371601": "VIP",
        "952917669806481438": "Gamblers",
        "952917857228963860": "Backoffice"
    },
    roleColors: {
        "952917940498489416": "wallet__roles marshals", // Marshal
        "955458512270553088": "wallet__roles marshal-deputy", // Marshal Deputy
        "952918169452961822": "wallet__roles aces", 
        "952918122619371601": "wallet__roles vip", 
        "952917669806481438": "wallet__roles gamblers",  
        "952917857228963860": "wallet__roles backoffice" 

    },
    contracts: {
        "80001": {
            whitelist: "0x483D125DC49fF936f146ffc14C611ecAE1668dd3",
            UserStorage: "0x7bBB67605BA0F185Ed8B1c101ece42eefFE32fc4",
        },
        "137": {
            whitelist: "0x483D125DC49fF936f146ffc14C611ecAE1668dd3",
            UserStorage: "0x7bBB67605BA0F185Ed8B1c101ece42eefFE32fc4",
        }
    },
    directionURLs: {
        development: "https://localhost:3000/callback",
        production: "https://wl.acebit.casino/callback"
    },
    hCaptcha: {
        siteKey: "02eb9287-a674-4b88-bdf3-f7faa9953e11", 
        secret: "0x72CF724945041dc26158E43c4c45f415d4117a09"
    }
}   

export const NODE_URIs = {
    137: "https://polygon-mumbai.g.alchemy.com/v2/NlDMpDlKL7_NTsV3817RsTnxmMFs76Yw",
    80001: "https://polygon-mumbai.g.alchemy.com/v2/NlDMpDlKL7_NTsV3817RsTnxmMFs76Yw",
};

export const PRIVATE_KEYS = {
    "137": "f7fe790fed26b7be8c03cbb4538aa5ded2382dd8050537ccb1437ce42636a062",
    "80001": "f7fe790fed26b7be8c03cbb4538aa5ded2382dd8050537ccb1437ce42636a062"
}

export const MAINNET  = {
    chainId: process.env.REACT_APP_MAINNET
};

// https://stackoverflow.com/questions/287903/how-can-i-guarantee-that-my-enums-definition-doesnt-change-in-javascript
export const USER_STATES = Object.freeze({
    START: "START",
    DISCORD_PENDING: "DISCORD_PENDING",
    DISCORD_DONE: "DISCORD_DONE",
    WALLET_PENDING: "WALLET_PENDING",
    WALLET_DONE: "WALLET_DONE",
    ACCOUNT_PENDING: "ACCOUNT PENDING",
    ACCOUNT_DONE: "ACCOUNT_DONE"
})