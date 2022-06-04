
const initialState = {

    userStates: {
        'APP_STARTED': {
            completed: false
        },
        'DISCORD_CONNECTED_PENDING': {
            completed: false
        },
        // 'DISCORD_ERROR': {
        //     completed: false
        // },
        'DISCORD_CONNECTED_PROCESSED': {
            completed: false
        },
        'DISCORD_CONNECTED_DONE': {
            completed: false
        },
        'WALLET_CONNECTED_PENDING': {
            completed: false
        },
        'WALLET_CONNECTED_DONE': {
            completed: false
        },
        'ACCOUNT_CREATED_PENDING': {
            completed: false
        },
        'ACCOUNT_CREATED_ADDING_USER': {
            completed: false
        },
        'ACCOUNT_CREATED_WHITELISTED': {
            completed: false
        },
        'ACCOUNT_CREATED_DONE': {
            completed: false
        }
    },

    userData: {
        'id': null,
        'username': null,
        'avatar': null,
        'avatar_decoration': null,
        'discriminator': null,
        'public_flags': 0,
        'flags': 0,
        'banner': null,
        'banner_color': null,
        'accent_color': null,
        'locale': 'en-US',
        'mfa_enabled': null,
        'premium_type': null
    },
    discordAccessToken: null,
    web3Data: {
        account: "",
        chainId: "350"
    }
}

const reducer = (state = initialState, action) => {
    console.log(action)

    // if (action.type === 'USER_LOGOUT') {
    //     return appReducer(undefined, action)
    // }


    switch (action.type) {
        case "RESET_INITIAL_STATE":
            console.log(initialState)
            return {
                ...initialState,
            };

        case 'USERDATA/UPDATE_USER_DATA':
            return {
                ...state,
                userData: action.payload
            }

        case 'USERDATA/UPDATE_WEB3_DATA':
            return {
                ...state,
                web3Data: {
                    account: action.payload.account,
                    chainId: action.payload.chainId
                }
            }

        case 'USERDATA/UPDATE_ACCESS_TOKEN':
            return {
                ...state,
                discordAccessToken: action.payload
            }

        case 'STATES/TOGGLE_STATE': {
            if (!state.userStates[action.payload]) {
                console.log("zero state")
                return state
            }
            if (state.userStates[action.payload]["completed"] == true) {
                return state
            }

            return {
                ...state,
                userStates: {
                    ...state.userStates,
                    [action.payload]: {
                        ...state.userStates[action.payload],
                        completed: true
                    }
                }
            }
        }
        default:
            return state;
    }

}

export default reducer;