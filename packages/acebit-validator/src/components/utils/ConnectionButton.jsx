
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
                    <div class="validator__account-title">
                        You don't have the Whitelist role!
                    </div>

                    <div class="validator__account-description">
                        Unfortunatelly, you don't have the Whitelist Role in the <a href="#">NeoWorld server</a>.
                        Learn more about the valid Whitelist Rules <a href="#">here</a>.
                    </div>

                </>
            )

        }

        return (

            <>
                <div class="validator__account-title">
                    Connect your Wallet
                </div>

                <div class="validator__account-description">
                    Please connect your wallet to check your <a href="#">Whitelising status</a>.
                </div>

                <a class="validator__account-link" href="#" onClick={this.connect}>
                    Connect wallet
                </a>
            </>

        )

    }
}

export default ConnectionButtonSection;