
import React, { useContext } from 'react';
import { PopupContext } from '../App';


function Popup() {

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)

    const getButton = (button) => {
        if (button.highlighted) {
            return (
                <a class="validator__verification-link" href="#" onClick={button.action}> {button.text} </a>
            )

        }

        return (
            <a class="header__btn-disconnect" href="#" onClick={button.action}> {button.text} </a>
        )

    }
    const getButtonList = (message) => {
        // console.log(message)
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
            <div class="validator__popup-box">
                <div class="validator__popup">
                    <div class="validator__popup-title">{popupMessage.header}</div>
                    <div class="validator__popup-des">{popupMessage.message}</div>
                    <div class="validator__popup-btn-box">

                        {getButtonList(popupMessage)}

                    </div>
                </div>
            </div>
        )

    }
    return null;
}

export default Popup;