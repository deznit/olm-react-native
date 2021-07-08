import {
    CAMERA_GRANTED_PERMISSION,
    CAMERA_NOT_GRANTED_PERMISSION,
    SET_GPS_COORDINATES,
    ZOOM_OUT,
    ZOOM_IN
} from '../actions/types';
import AsyncStorage from '@react-native-community/async-storage';

// state.camera.email
const INITIAL_STATE = {
    autoFocus: 'on',
    cameraRollUri: null,
    errorMessage: null,
    lat: null,
    lon: null,
    location: null,
    photoId: 1,
    photos: [],
    type: 'back',
    zoom: 0
};

export default function (state = INITIAL_STATE, action) {

    switch (action.type)
    {
        case SET_GPS_COORDINATES:
            return {
                ...state,
                lat: action.payload.lat,
                lon: action.payload.lon
            };

        case ZOOM_OUT:
            return {
                ...state,
                zoom: state.zoom - 0.1 < 0 ? 0 : state.zoom - 0.1
            }

        case ZOOM_IN:
            return {
                ...state,
                zoom: state.zoom + 0.1 > 1 ? 1 : state.zoom + 0.1
            }

        default:
            return state;
    }
};
