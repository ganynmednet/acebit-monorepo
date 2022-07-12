
import { connect } from 'react-redux';
import React, { useContext } from 'react';
import { PopupContext } from '../App';
import { getUniqueKey } from "../helpers"


function Popup(props) {

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)

    const getButton = (button) => {

        if (button.highlighted) {
            return (

                <a class="popup__disconnect-btn global__btn-yellow" href="#" onClick={button.action} key={getUniqueKey()}>
                    {button.text}
                </a>

            )

        }

        return (

            <div class="popup__disconnect-cancel global__btn-opacity" key={getUniqueKey()}>
                {button.text}
            </div>
        )

    }
    const getButtonList = (message) => {
        if (!message) {
            return;
        }

        return (
            message.buttons.map((button, i) =>
                getButton(button)
            )
        )
    }

    if (popupMessage) {
        return (
            <div class="popup__disconnect popup__disconnect-active">
                <div class="popup__disconnect-content">
                    <div class="popup__disconnect-title">
                        {popupMessage.header}
                    </div>
                    <div class="popup__disconnect-description">
                        {popupMessage.message}
                    </div>
                    <div class="popup__disconnect-buttons">
                        <div class="popup__disconnect-cancel global__btn-opacity">
                            Cancel
                        </div>
                        <a class="popup__disconnect-btn global__btn-yellow" href="#">
                            Disconnect
                        </a>
                    </div>
                </div>
            </div>
        )

    }

    return null;
}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(Popup);