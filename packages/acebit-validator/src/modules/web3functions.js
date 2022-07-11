
import { ethers, utils } from 'ethers';
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { config, PRIVATE_KEYS, NODE_URIs, MAINNET} from '../configs/config';
import userStorageAbi from '../abi/userStorage.json'



export const SingMessage = async (message, signer) => {
    console.log("SIGN MESSAGE " + message)

    let signature;
    const hexMessage = utils.hexlify(utils.toUtf8Bytes(message))
    try {
        signature = await signer.signMessage(hexMessage);
        console.log(signature)
    } catch (error) {
        console.log(error)
        return false;
    }

    console.log(signature)
    return true;

}

export const checkWhitelistStatus = async (signer, userAccount) => {
    // const whitelistContract = new ethers.Contract(config.contracts[MAINNET.chainId].whitelist, abi.data, signer);
    console.log(config.contracts[MAINNET.chainId].UserStorage)
    const whitelistContract = new ethers.Contract(config.contracts[MAINNET.chainId].UserStorage, userStorageAbi.data, signer);
    console.log(whitelistContract)
    let _res
    try {
        _res = await whitelistContract.isUserWhitelisted(ethers.utils.getAddress(userAccount));
        console.log(_res)
    } catch (error) {
        console.log(error)
        return false;
    }
    return _res
}


export const addUser = async (newUserData) => {
    console.log(MAINNET.chainId)
    var _provider = new StaticJsonRpcProvider(NODE_URIs[Number(MAINNET.chainId)])
    const signer = new ethers.Wallet(PRIVATE_KEYS[MAINNET.chainId], _provider)
    const whitelistContract = new ethers.Contract(config.contracts[MAINNET.chainId].UserStorage, userStorageAbi.data, signer);

    let _res

    try {
        _res = await whitelistContract.addUser(
            ethers.utils.getAddress(newUserData.account),
            newUserData.username,
            newUserData.discordId,
            newUserData.userEmail,
            "Presale Whitelisting",
            true,
            new Date().getTime()
        );
        console.log(_res)
    } catch (error) {
        console.log(error)
        return false;
    }

    return true;

}



// Welcome to PREMINT!

// Signing is the only way we can truly know 
// that you are the owner of the wallet you 
// are connecting. Signing is a safe, gas-less 
// transaction that does not in any way give 
// PREMINT permission to perform any 
// transactions with your wallet.

// Wallet address:
// 0xdf05ce25b93a11d0a39439e6f6b4d7e3bb554543

// Nonce: K3R56KMVOVJVBBP7F4Z9V3JVDANUBWED