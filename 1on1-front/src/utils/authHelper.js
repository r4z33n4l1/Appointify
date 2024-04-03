import { decode } from "jsonwebtoken";

export const removeTokens = () => {
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
        if (access && access !== 'undefined') {
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
                        'Content-Type': 'application/json',
                        
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
        
        if (response.ok) {
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          return true; // Indicate success
        } else {
          throw new Error(data.message || 'Login failed.'); // Throw an error with the response message
        }
      } catch (error) {
        throw error; // Rethrow any network error to be caught by the caller
      }
    }


export async function signup(userData) {
    try {
        const response = await fetch('http://127.0.0.1:8000/auth/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.status === 201) {
            // User created successfully
            return { success: true };
        } else if (response.status === 400) {
            // Handle bad request errors, including validation messages
            const errorData = await response.json();
            return { success: false, errors: errorData };
        } else {
            // Handle other types of errors generically
            throw new Error('An error occurred during sign up.');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
}
