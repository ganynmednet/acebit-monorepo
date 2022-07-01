
import { connect } from 'react-redux';



function Mint(props) {

    return (
        <div>
            Mint
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