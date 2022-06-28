import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { addressShortener, getDefaultAvatar } from '../../helpers';
import { ConnectWallet, DisconnectWallet } from '../../modules/web3Client.js';
import SignupForm from '../utils/SignupForm';
import { Web3Context } from '../../App';
import { PopupContext } from '../../App';
import Davatar from '@davatar/react';


function CreateAccountStep(props) {
    // var _account = props.account;

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)
    const { signer, setSigner, provider, setProvider } = useContext(Web3Context)

    async function handleChange() {
        ConnectWallet(showPopup, hidePopup, setProvider, setSigner)
    }

    return (

        <div class="create true">

            <div class="create__title">Create Account</div>

            <div class="create__connected-box">
                <div class="create__connected-title">ConnectED with metamask</div>
                <div class="create__connected-content">
                    <Davatar size={24} address={"0x7bBB67605BA0F185Ed8B1c101ece42eefFE32fc4"} generatedAvatarType='jazzicon' />
                    {/* {
                            getDefaultAvatar("0x7bBB67605BA0F185Ed8B1c101ece42eefFE32fc4")
                        } */}

                    <img class="create__connected-logo" src="./images/create/logo.svg" alt="" />
                    <div class="create__connected-name">{addressShortener(props.account)}</div>
                    <div class="create__connected-change" onClick={handleChange} >Change</div>
                </div>
            </div>

            <SignupForm rerendRouter={props.rerendRouter} />

        </div >
    )

}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(CreateAccountStep);