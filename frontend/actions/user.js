import fetch from 'isomorphic-fetch';
import { API } from '../config';

export const userPublicProfile = (username) => {
    return fetch(`${API}/api/user/${username}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};
