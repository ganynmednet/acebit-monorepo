
import { ethers, utils } from 'ethers';
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { config, PRIVATE_KEYS, NODE_URIs, MAINNET} from '../configs/config';
import userStorageAbi from '../abi/userStorage.json'


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

export const ifMintLive = async () => {

}

export async function Mint(_mintable) {

    // check if mint live
    // check if user whitelisted
    // check if _mintable available

    // mint
    // update State Machine

}