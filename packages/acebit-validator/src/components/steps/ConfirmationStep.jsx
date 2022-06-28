
import { connect } from 'react-redux';

function ConfirmationScreen(props) {

    return (
        <div class="congratulations">
            <div class="congratulations__logo">
                <img src="./images/congratulations/congratulations-logo.png" alt="" />
            </div>
            <div class="congratulations__title">
                Congratulations! 🎉
            </div>
            <div class="congratulations__description">
                Your wallet has been successfully validated
                and is ready to participate in the 
                <a class="congratulations__description-link" href="#"> AceBit Private Mint.</a>
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
