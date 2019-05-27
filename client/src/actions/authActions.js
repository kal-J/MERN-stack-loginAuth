import axios from 'axios';
import setAuthToken from './../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { SET_CURRENT_USER, USER_LOADING, GET_ERRORS } from './types';

//Register user
export const registerUser = (userData, history) => (dispatch) => {
    axios.post('api/users/register', userData)
         .then( res => history.push('/login')) //redirect to login page on success
         .catch( err => dispatch({
             type: GET_ERRORS,
             payload: err.response.data
         }));
};

// Log in and get user token
export const loginUser = (userData, history) => (dispatch) => {
    axios.post('api/users/login', userData)
         .then( res => {
             //save token to localStorage
             const { token } = res.data;
             localStorage.setItem('jwtToken', token);

             //set token to Auth header
             setAuthToken(token);

             //decode token to get user data
             const decoded = jwt_decode(token);

             //set current User
             dispatch(setCurrentUser(decoded));
         })
         .catch( err => dispatch({
             type: GET_ERRORS,
             payload: err.response.data
         }));
};

//set logged user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// user loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

//logout user
export const logoutUser = () => dispatch => {
    // remove token from local storage
    localStorage.removeItem('jwtToken');
    
    //remove auth header for future requests
    setAuthToken(false);

    //set current user to empty object {}
    dispatch(setCurrentUser({}));
};
