import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { addressShortener, getDefaultAvatar } from '../../helpers';
import { ConnectWallet, DisconnectWallet } from '../../modules/web3Client.js';
import SignupForm from '../utils/SignupForm';
import { Web3Context } from '../../App';
import { PopupContext } from '../../App';


function CreateAccountStep(props) {
    // var _account = props.account;

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)
    const { setSigner, setProvider } = useContext(Web3Context)

    async function handleChange() {
        ConnectWallet(showPopup, hidePopup, setProvider, setSigner)
    }

    return (
        <div class="create validator__content-box">

            <div class="create validator__content">
                <div class="create-close-popup">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 18L18 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M2 2L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </div>
                <div class="create validator__account-title ">
                    Create Account
                </div>
                <div class="create validator__account">
                    <div class="create__title-connect">
                        Connected Account
                    </div>
                    <div class="create__metamask-box">
                        {/* <img class="create__metamask-img" src="./images/metamask-img.svg" /> */}
                        {/* 
                        {
                            getDefaultAvatar(_account)
                        } */}

                        <div class="create__metamask-text">{addressShortener(props.account)}</div>
                    </div>
                    <div class="create__btn" onClick={handleChange}>Change</div>
                </div>


                <SignupForm rerendRouter={props.rerendRouter} />


            </div>
        </div>
    )

}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(CreateAccountStep);