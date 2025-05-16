import { BASE_API_URL } from "../register/page";

/**
 * Checks if refreshToken is inside the local storage of the browser.
 * @param {any} localStorage the window.localStorage.
 * @returns {boolean}
 */
export function isThereAnyToken (localStorage: any) {
    if (localStorage.getItem("refreshToken")) {
        return true;
    } else {
        return false;
    }
};

/**
 * Return the refreshToken in the local storage if it exists and null if it doesn't.
 * @param {any} localStorage
 * @returns {string|null}
 */
export const refresh= (localStorage: any) => {
    if (isThereAnyToken(localStorage)) {
        return window.localStorage.getItem('refreshToken');
    } else {
        return null;
    }
}
/**
 * Return the accessToken in the local storage if it exists and null if it doesn't.
 * @param {any} localStorage
 * @returns {string|null}
 */
export const access= (localStorage: any) => {
    if (isThereAnyToken(localStorage)) {
        return window.localStorage.getItem('accessToken');
    } else {
        return null;
    }
}

/**
 * Check if the user is really logged in by validating the token from an API
 * @param {string|null} token 
 * @returns {boolean}
 */
export const checkToken= async (token: string|null) => {
    if(token=== null) {
        return false;
    }
    try{
        const response= await fetch(BASE_API_URL + '/check-token', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({token: token})
        });
        const data= await response.json();
        // console.log(data);
        if(data.success=== true) {
            return true;
        } else {
            return false;
        }
    } catch (error){
        console.log("Can't fetch shit. Aborting...");
        console.log(error);
    };
};