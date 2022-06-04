import React, { useState, useEffect, createContext } from "react"
import Header from './components/Header';
import Popup from './components/Popup';

export const PopupContext = createContext();
export const Web3Context = createContext();

function App() {

    const [userState, setUserState] = useState(0);
    const [popupMessage, setPopupMessage] = useState(null);


    function showPopup(message) {
        setPopupMessage(message);
    }

    function hidePopup() {
        setPopupMessage(null);
    }

    function changeState(state) {
        setUserState(state)
    }


    console.log("RENDER: APP")
    return (
        <>
            {/* <Web3Context.Provider value={{ connect, disconnect, account, signer, provider }}> */}
            <PopupContext.Provider value={{ showPopup, hidePopup, popupMessage }}>
                <div class="validator__main">
                    <Popup hidePopup={hidePopup} />
                    <Header showPopup={showPopup} />
                </div>
            </PopupContext.Provider>
            {/* </Web3Context.Provider> */}
        </>
    )
}

export default App;