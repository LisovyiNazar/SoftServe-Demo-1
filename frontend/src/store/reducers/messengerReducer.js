import { FRIENDS_GET_SUCCESS, MESSAGE_GET_SUCCESS, MESSAGE_SEND_SUCCESS, SOCKET_MESSAGE } from "../types/messengerType"
import { LOGOUT_SUCCESS } from "../types/authType"

const messengerState = {
    friends: [],
    message: [],
    gallery: []
}

export const messengerReducer = (state = messengerState, action) => {
    const {type, payload} = action

    if(type === FRIENDS_GET_SUCCESS) { 
        return {
            ...state,
            friends: payload.friends
        }
    }
    
    if(type === MESSAGE_GET_SUCCESS) { 
        return {
            ...state,
            message : payload.message,
            gallery : payload.gallery 
        }
    }

    if(type === MESSAGE_SEND_SUCCESS) { 
        return {
            ...state,
            message : [...state.message, payload.message],
            gallery : [...state.gallery, payload.message]
        }
    }
    
    if(type === SOCKET_MESSAGE) { 
        return {
            ...state,
            message : [...state.message, payload.message],
            gallery : [...state.gallery, payload.message]
        }
    }
    
    if(type === LOGOUT_SUCCESS) { 
        return {
            ...state,
            friends: [],
            message: []
        }
    }

    return state
}
