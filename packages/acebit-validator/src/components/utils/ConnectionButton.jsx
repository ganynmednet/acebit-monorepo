
import React from 'react';
// import UserProfile from '../storage/userProfile';

class ConnectionButtonSection extends React.Component {

    constructor(props) {
        super(props);
        this.userData = props.userData;
        // this.changeState = props.changeState;
        this.connect = props.connect
    }

    render() {

        if (this.userData.roles.length == 0) {

            return (
                <>
                    <div class="wallet__title">
                        You don't have the Whitelist role!
                    </div>

                    <div class="wallet__des">
                        Unfortunatelly, you don't have the Whitelist Role in the <a className="congratulations__description-link" href="https://discord.gg/vuZKRh6bt9">AceBit server</a>.
                        Learn more about the valid Whitelist Rules <a className="congratulations__description-link" href="https://docs.acebit.casino/ace-sale/whitelist">here</a>.
                    </div>

                </>
            )

        }

        return (

            <>
                {/* <div class="validator__account-title">
                    Connect your Wallet
                </div>

                <div class="validator__account-description">
                    Please connect your wallet to check your <a href="#">Whitelising status</a>.
                </div>

                <a class="validator__account-link" href="#" onClick={this.connect}>
                    Connect wallet
                </a> */}


                <div class="wallet__title">Connect your wallet</div>
                <div class="wallet__des">
                    Connect your Discord account to link
                    it to your AceBit profile.
                </div>
                <a class="wallet__auth global__btn-yellow" href="#" onClick={this.connect}>
                    Connect wallet
                </a>
            </>

        )

    }
}

export default ConnectionButtonSection;