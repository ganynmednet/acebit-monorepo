
import { connect } from 'react-redux';

function ConfirmationScreen(props) {

    return (
        <div class="validator__content-box">
            <div class="validator__content">
                <div class="validator__congratulations-logo">
                    <img src="./images/validator-logo-congratulations.png" alt="" />
                </div>
                <div class="validator__congratulations-title">
                    Congratulations! 🎉
                </div>
                <div class="validator__congratulations-description">
                    Your Wallet has been succesfully validated and added to the Whitelist!
                </div>
            </div>
        </div>
    )

}

const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates,
        userData: store.userData
    }
}

export default connect(mapStateToProps)(ConfirmationScreen);
