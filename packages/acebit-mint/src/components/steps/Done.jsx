
import { connect } from 'react-redux';



function Done(props) {

    return ("Done")
}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(Done);