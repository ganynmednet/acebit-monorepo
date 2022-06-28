import React, { useState, useEffect, createContext } from "react"
import { Provider } from "react-redux";
import store from "./store";
import Header from './components/Header';
import Popup from './components/Popup';
import StateRouter from "./components/StateRouter";

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

                        <div className="validator">

                            <Popup hidePopup={hidePopup} />
                            <Header showPopup={showPopup} />

                            <div className="validator__content">

                                <StateRouter />

                            </div>
                        </div>

                    </PopupContext.Provider>
                </Provider>
            </Web3Context.Provider>
        </>
    )
}

export default App;