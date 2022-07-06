require('dotenv')


export const config = {
    discordServer: "952915415078694972",
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
