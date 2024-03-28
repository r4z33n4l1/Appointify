import { decode } from "jsonwebtoken";

export const logout = () => {
    if (typeof window !== 'undefined') { // Make sure we're in the client side
        try {
            // log the access and refresh before removing them
            console.log(localStorage.getItem('access'));
            console.log(localStorage.getItem('refresh'));
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            console.log("removed tokens");
        } catch (error) {
            console.error('Error occurred while logging out:', error);
        }
    }
};

// check if access token is expired, by comparing the current time with the expiration time
// if expired send refresh token to /auth/refresh/ to get a new access token

export const accessValid = () => {
    if (typeof window !== 'undefined') {
        const access = localStorage.getItem('access');
        if (access) {
            const decoded = decode(access);
            return decoded.exp > Date.now() / 1000;
        }
    }
    return false;
};

// refresh token
export const refresh = async () => {
    if (typeof window !== 'undefined') {
        const refresh = localStorage.getItem('refresh');
        if (refresh) {
            try {
                const response = await fetch('http://127.0.0.1:8000/auth/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refresh })
                });
                const data = await response.json();
                localStorage.setItem('access', data.access);
                console.log(data);
                return data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
}

// create a function that will return true if the user is logged in, false otherwise
export const isLoggedIn = async () => {
    if (typeof window !== 'undefined') {
        console.log("checking if logged in")
        if (accessValid()) {
            return true;
        } else {
            try {
                await refresh();
                if (accessValid()) {
                    return true;
                } else {
                    logout();
                    return false;
                }
            } catch (error) {
                console.error('Error occurred while refreshing access token:', error);
                logout();
                return false;
            }
        }
    }
    return false;
};


export async function login(username, password) {
    try {
        const response = await fetch('http://127.0.0.1:8000/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}