
import { connect } from 'react-redux';



function Error(props) {

    return ("Error")
}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(Error);