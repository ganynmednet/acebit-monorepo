import React, { useState, useEffect, createContext } from "react"
import Header from './components/Header';
import Popup from './components/Popup';
import store from "./store";
import { Provider } from "react-redux";

export const PopupContext = createContext();
export const Web3Context = createContext();

function App() {

    const [provider, setProvider] = useState(0);
    const [signer, setSigner] = useState(0);
    const [popupMessage, setPopupMessage] = useState(null);



    function showPopup(message) {
        setPopupMessage(message);
    }

    function hidePopup() {
        setPopupMessage(null);
    }


    console.log("RENDER: APP")
    return (
        <>
            <Web3Context.Provider value={{ signer, setSigner, provider, setProvider }}>
                <Provider store={store} >
                    <PopupContext.Provider value={{ showPopup, hidePopup, popupMessage }}>
                        <div class="validator__main">
                            <Popup hidePopup={hidePopup} />
                            <Header showPopup={showPopup} />
                        </div>
                    </PopupContext.Provider>
                </Provider>
            </Web3Context.Provider>
        </>
    )
}

export default App;