
import { connect } from 'react-redux';



function PreMint(props) {

    return (
        <div>
            PreMint
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