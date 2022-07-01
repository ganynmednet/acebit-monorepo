
import { connect } from 'react-redux';



function Header(props) {

    return (
        <div>
            Header
        </div>
    )
}


const mapStateToProps = function (store) {
    return {
        account: store.web3Data.account,
        userStates: store.userStates
    }
}

export default connect(mapStateToProps)(Header);