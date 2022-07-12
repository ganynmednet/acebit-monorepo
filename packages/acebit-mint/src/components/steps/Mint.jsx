
import { connect } from 'react-redux';



function Mint(props) {

    return (
        <div class="mint">
            <div class="mint__img">
                <img src="./images/mint/mint-img.svg" alt="" />
            </div>
            <div class="mint__title">
                AceBit Private Mint
            </div>
            <div class="mint__already">
                <div class="mint__already-title">
                    Already Minted
                </div>
                <div class="mint__already-container">
                    <div class="mint__already-ready">
                        50
                    </div>
                    <div class="mint__already-maximum">
                        / 2222
                    </div>
                </div>
            </div>
            <div class="mint__count">
                <div class="mint__amount">
                    <div class="mint__amount-title">
                        Amount of NFTs
                    </div>
                    <div class="mint__input">
                        <label>
                            <input type="number" value="3" />
                        </label>
                        <div class="mint__input-container">
                            <div class="mint__input-increment">
                                <img src="./images/mint/mint-arrow.svg" alt="" />
                            </div>
                            <div class="mint__input-decrement">
                                <img src="./images/mint/mint-arrow.svg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mint__total">
                    <div class="mint__total-title">
                        Total Cost:
                    </div>
                    <div class="mint__total-count">
                        0.856 <span class="mint__total-eth">ETH</span>
                    </div>
                </div>
            </div>

            <div class="mint__buttons-take">
                <div class="mint__buttons">
                    <div class="mint__buttons-container">
                        <div class="mint__buttons-stake">mint and stake</div>
                        <div class="mint__buttons-info">
                            <div class="mint__buttons-description">
                                Receive in your wallet without ACEBIT earnings
                            </div>
                            <div class="mint__buttons-question">?</div>
                        </div>
                    </div>
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

export default connect(mapStateToProps)(Mint);