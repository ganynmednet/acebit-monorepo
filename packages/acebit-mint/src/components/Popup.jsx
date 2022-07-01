
import { connect } from 'react-redux';



function Popup(props) {

    return (
        <div>
            Popup
        </div>
    )
}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(Popup);