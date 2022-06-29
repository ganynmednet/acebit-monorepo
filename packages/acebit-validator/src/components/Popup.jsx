
import React, { useContext } from 'react';
import { PopupContext } from '../App';
import { getUniqueKey } from "../helpers"


function Popup() {

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)

    const getButton = (button) => {
        if (button.highlighted) {
            return (
                // <a class="validator__verification-link" href="#" onClick={button.action}> {button.text} </a>

                <a class="popup__disconnect global__btn-yellow" href="#" onClick={button.action} key={getUniqueKey()}>
                    {button.text}
                </a>

            )

        }

        return (
            // <a class="header__btn-disconnect" href="#" onClick={button.action}> {button.text} </a>

            <div class="popup__cancel global__btn-opacity" key={getUniqueKey()}>
                {button.text}
            </div>
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

            <div class="popup active">
                <div class="popup__content">
                    <div class="popup__title">
                        {popupMessage.header}
                    </div>
                    <div class="popup__description">
                        {popupMessage.message}
                    </div>
                    <div class="popup__buttons">
                        {getButtonList(popupMessage)}

                    </div>
                </div>
            </div>

        )

    }
    return null;
}

export default Popup;