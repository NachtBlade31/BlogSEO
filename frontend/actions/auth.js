import fetch from 'isomorphic-fetch';
import { API } from '../config';
import cookie from 'js-cookie';
import Router from 'next/router'
export const handleResponse = response => {
    if (response.status === 401) {
        logout(() => {
            Router.push({
                pathname: '/login',
                query: {
                    message: 'Your Session is expired. Please login Again'
                }
            })
        })

    }
    else {
        return;
    }
}
export const signup = (user) => {
    return fetch(`${API}/api/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};

export const preSignup = (user) => {
    return fetch(`${API}/api/pre-signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};

export const login = (user) => {
    return fetch(`${API}/api/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};

export const logout = (next) => {
    removeCookie('token')
    removeLocalStorage('user')
    next();
    return fetch(`${API}/logout`, {
        method: 'GET'
    })
        .then(response => {
            console.log('Successfuly Logged out')
        })
        .catch(err => console.log(err));
}

//set cookie
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1
        })
    }
}

export const removeCookie = (key) => {
    if (process.browser) {
        cookie.remove(key, {
            expires: 1
        })
    }
}
//get cookie

export const getCookie = (key) => {
    if (process.browser) {
        return cookie.get(key);
    }
}

//localstorage

export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value))
    }
}


export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key)
    }
}
//auntenticate user by pass data to cookie ad localstorage

export const authenticate = (data, next) => {
    setCookie('token', data.token)
    setLocalStorage('user', data.user)
    next();
}

export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token')
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            }
            else {
                return false;
            }
        }
    }
}

export const updateUser = (user, next) => {
    if (process.browser) {
        if (localStorage.getItem('user')) {
            let auth = JSON.parse(localStorage.getItem('user'))
            auth = user
            localStorage.setItem('user', JSON.stringify(auth))
            next();
        }
    }
}

export const forgotPassword = (email) => {
    return fetch(`${API}/api/forget-password`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};


export const resetPassword = (resetInfo) => {
    return fetch(`${API}/api/reset-password`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};