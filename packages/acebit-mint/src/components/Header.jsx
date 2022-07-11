
import { connect } from 'react-redux';
import { PopupContext } from '../App';
import { Web3Context } from '../App';
import { ConnectWallet, DisconnectWallet } from '../modules/web3Client.js';
import { addressShortener } from '../helpers';



function Header(props) {

    const { showPopup, hidePopup, popupMessage } = useContext(PopupContext)
    const { setSigner, setProvider } = useContext(Web3Context)

    const connectWallet = () => {
        console.log("HEADER: I TRY TO CONNECT")
        ConnectWallet(showPopup, hidePopup, setProvider, setSigner)
    }

    const disconnectWallet = () => {
        console.log("HEADER: I TRY TO CONNECT")
        DisconnectWallet(setProvider, setSigner)
    }

    const getButtonText = () => {
        // console.log(props)
        if (props.account) {
            return (
                <a class="validator__disconnect" href="" onClick={disconnectWallet}> {addressShortener(props.account)} </a>

            )
        }

        return;

    }


    return (
        <div>
            Header
        </div>
    )
}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(Header);