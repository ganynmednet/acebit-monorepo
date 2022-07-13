
import { connect } from 'react-redux';



function PreMint(props) {

    return (
        <div class="twitter">
            <div class="twitter__box">
                <div class="twitter__title">Private Mint Begins in</div>
                <div class="twitter__content-top">
                    <div class="twitter__announced">
                        <div class="twitter__announced-text">
                            to be announced
                        </div>
                    </div>
                </div>

                <div class="twitter__btn-container">
                    <a class="twitter__btn" href="#">
                        <img src="./images/twitter/twitter-btn.png" alt="" />
                    </a>
                </div>

                <div class="twitter__des">
                    Or, view your transaction on the blockchain by clicking
                    <a href="#"> here</a>.
                </div>
            </div>
            <div class="twitter__bottom-box">
                <div class="twitter__bottom-btn">
                    <img src="./images/twitter/union.svg" alt="" />
                    <span>Check your Wl status</span>
                </div>
                <div class="twitter__bottom-btn date">
                    <img src="./images/twitter/date.svg" alt="" />
                    <span>Mark the date!</span>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(PreMint);