import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
    // cacheProvider: false, // optional
    // providerOptions: {
    walletconnect: {
        package: WalletConnectProvider,
        options: {

            rpc: {
                80001: "https://polygon-mumbai.g.alchemy.com/v2/NlDMpDlKL7_NTsV3817RsTnxmMFs76Yw",
            },
            qrcodeModalOptions: {
                mobileLinks: ["metamask", "imtoken"]
            }
        },
    },
    // walletconnect: {
    //     package: WalletConnectProvider, // required
    //     options: {
    //         infuraId: "p/4ouJmKGFEP1l1TSJaFP" // required
    //     },
    //     qrcodeModalOptions: {
    //         mobileLinks: ["metamask", "imtoken"]
    //     }
    // },
    // },
};