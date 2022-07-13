import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { addUser } from "../../modules/web3Functions_";
import { addressShortener, getDefaultAvatar, validUsername, verifyCaptchaAPI } from '../../helpers';
import { ConnectWallet, DisconnectWallet } from '../../modules/web3Client.js';
import { config, MAINNET } from '../../configs/config';
import { Web3Context } from '../../App';
import { PopupContext } from '../../App';
import Davatar from '@davatar/react';
import store from '../../store';


function CreateAccountStep(props) {

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)
    const { signer, setSigner, provider, setProvider } = useContext(Web3Context)

    const [available, setAvailable] = useState(null)
    const [captcaVerified, setCaptchaVerified] = useState(false)

    async function handleChange() {
        ConnectWallet(showPopup, hidePopup, setProvider, setSigner)
    }

    const checkNetwork = async () => {
        const chain = await provider.getNetwork();
        console.log("Check network >>>>>>>")
        console.log(chain.chainId, MAINNET.chainId)


        if (chain.chainId != MAINNET.chainId) {
            showPopup({
                header: "Invalid chain",
                message: `Please switch your Wallet to the Polygon Maianet to continue the verification.`,
                buttons: [
                    {
                        text: "Understand",
                        highlighted: true,
                        action: hidePopup
                    }
                ]
            })

            return false;
        } else {
            return true;
        }
    }

    async function handleVerificationSuccess(token, ekey) {
        var _res = await verifyCaptchaAPI(token, ekey)
        console.log(_res)
        if (_res) {
            console.log("capthca verified")
            setCaptchaVerified(true)
        }
        return;
    }

    function getAvailable(available) {
        if (available == true) {
            return "VALID NAME"
        }
        if (available == false) {
            return "NOT AVAIILABLE"
        }
        return null;
    }

    function validateInput(data) {

        console.log(validUsername.test(data))

        if (data.length == 0) {
            setAvailable(null)
            return;
        }

        if (data.length < 4 || data.length > 20) {
            setAvailable(false)
            return;
        }


        if (!validUsername.test(data)) {
            setAvailable(false)
            return;
        }

        setAvailable(true)
    }


    async function submitUserData(event) {
        event.preventDefault();
        // console.log(event.target.elements.username.value)

        if (! await checkNetwork()) {
            return;
        }

        console.log(captcaVerified)

        if (captcaVerified) {

            showPopup({
                header: "Captcha is invalid",
                message: `Please switch your Wallet to the Polygon Maianet to continue the verification.`,
                buttons: [
                    {
                        text: "Understand",
                        highlighted: true,
                        action: hidePopup
                    }
                ]
            })
            return;
        }


        if (!props.userStates["ACCOUNT_CREATED_PENDING"].completed) {
            console.log("DISPATCH >>>")
            store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "ACCOUNT_CREATED_PENDING" })
        }

        var userPayload = {
            account: props.account,
            username: event.target.elements.username.value.toString(),
            discordId: props.userData.id,
            userEmail: props.userData.email
        }
        console.log(userPayload)

        var _res = await addUser(userPayload)

        if (!_res) {
            store.dispatch({ type: "STATES/TOGGLE_STATE_BACK", payload: "ACCOUNT_CREATED_PENDING" })
            showPopup({
                header: "Something went wrong!",
                message: `Please try again later on contact Support in AceBit Discord server.`,
                buttons: [
                    {
                        text: "Try Later",
                        highlighted: true,
                        action: hidePopup
                    }
                ]
            })
            return;
        }

        store.dispatch({ type: "STATES/TOGGLE_STATE", payload: "ACCOUNT_CREATED_DONE" })
        return;
    }


    return (

        <div class={ available ? "create true" : "create error"}>

            <div class="create__title">Create Account</div>

            <div class="create__connected-box ">
                <div class="create__connected-title">Connected wallet</div>
                <div class="create__connected-content">
                    {/* <Davatar size={24} address={"0x7bBB67605BA0F185Ed8B1c101ece42eefFE32fc4"} generatedAvatarType='jazzicon' /> */}
                    {/* {
                            getDefaultAvatar("0x7bBB67605BA0F185Ed8B1c101ece42eefFE32fc4")
                        } */}

                    <img class="create__connected-logo" src="./images/create/logo.svg" alt="" />
                    <div class="create__connected-name">{addressShortener(props.account)}</div>
                    <div class="create__connected-change" onClick={handleChange} >Change</div>
                </div>
            </div>

            {/* <SignupForm rerendRouter={props.rerendRouter} /> */}


            <form onSubmit={submitUserData} className="form__body" action="#" method="post">

                <div class="create__username">Create Username<span>*</span></div>
                <div class={ available === null ? "create__username-box error" : "create__username-box true"}>
                    <div class="create__username-top">
                        <div class="create__username-top-text">Must be 4—20 characters</div>
                        <div class="create__username-top-text">{getAvailable(available)}</div>
                    </div>
                    <input class="create__username-input" type="text" name="username" onChange={e => validateInput(e.target.value)} />
                </div>

                <div class="create__captcha">
                    <HCaptcha
                        sitekey={config.hCaptcha.siteKey}
                        onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
                        theme="dark"
                    />
                </div>

                <button type="submit" class="create__btn" href="#">
                    Create Account
                </button >

            </form>
        </div >
    )

}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        chainId: store.web3Data.chainId,
        userStates: store.userStates,
        userData: store.userData
    }
}

export default connect(mapStateToProps)(CreateAccountStep);