import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { addUser } from "../../modules/web3functions";
import { config, MAINNET } from '../../configs/config';
import { verifyCaptchaAPI, validUsername } from "../../helpers"
import BouncingDotsLoader from './BouncingDotsLoader';
import { PopupContext } from '../../App';
import { Web3Context } from '../../App';
import store from '../../store';


function SignupForm(props) {
    // console.log(props)
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const [available, setAvailable] = useState(null)
    const [captcaVerified, setCaptchaVerified] = useState(false)
    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)
    const { connect, disconnect, account, signer, provider } = useContext(Web3Context)

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
                header: "Something went wrong! Please try again later on contact Support in AceBit Discord server.",
                message: `Please try later`,
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

    function getCheckMark() {
        return (
            <div class="create__check">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3.14286L3.90909 6L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        )
    }

    function validateInput(data) {

        console.log(validUsername.test(data))

        if (data.length < 4 || data.length > 20) {
            setAvailable(false)
            return;
        }

        
        if(!validUsername.test(data)) {
            setAvailable(false)
            return;
        }

        setAvailable(true)
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

    async function handleVerificationSuccess(token, ekey) {
        var _res = await verifyCaptchaAPI(token, ekey)
        console.log(_res)
        if (_res) {
            setCaptchaVerified(true)
        }
        return;
    }

    function GetButtonState() {
        if (props.userStates["ACCOUNT_CREATED_PENDING"].completed) {
            return <BouncingDotsLoader />
        }

        if (available) {

            return (
                <button type="submit" class="create__btn" href="#">
                    Create Account
                </button >
            )

        }

        return (
            <>Innactive button</>
        )

    }

    return (
        <>
            <form onSubmit={submitUserData} className="form__body" action="#" method="post">

            <div class="create__username">Create Username<span>*</span></div>
                <div class="create__username-box true">
                    <div class="create__username-top">
                        <div class="create__username-top-text">Must be 4—20 characters</div>
                        <div class="create__username-top-text">{getAvailable(available)}</div>
                    </div>
                    <input class="create__username-input" type="text"  onChange={e => validateInput(e.target.value)} />
                </div>

                <div class="create__captcha">
                    <HCaptcha
                        sitekey={config.hCaptcha.siteKey}
                        onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
                    />
                </div>

                < GetButtonState />

                {/* <a class="create__btn" href="#">Create Account</a>


                <div class="create__user-name-box">
                    <div class="create__user-name-title">Create Username<span>*</span></div>
                    <div class="create__input-name-box">
                        <div class="create__input-name-wrapper">

                            {available ? getCheckMark() : null}

                            <div class="create__name-des-box">
                                <div class="create__input-name">Must be 3—20 characters</div>
                                <div class="create__input-name">{getAvailable(available)}</div>
                            </div>

                            <input
                                type="text"
                                onChange={e => validateInput(e.target.value)}
                                // value={formik.values.username}
                                name="username"
                                maxLength="20"
                                class="create__input"
                            />

                        </div>

                    </div>
                </div>


                <div class="create__captcha">
                    <HCaptcha
                        sitekey={config.hCaptcha.siteKey}
                        onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
                    />
                </div> */}

                

            </form>

        </>
    );
};

const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        chainId: store.web3Data.chainId,
        userStates: store.userStates,
        userData: store.userData
    }
}

export default connect(mapStateToProps)(SignupForm);