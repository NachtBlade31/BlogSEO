import fetch from 'isomorphic-fetch';
import { API } from '../config';

export const emailContactForm = (data) => {

    let emailEndpoint
    if (data.authorEmail) {
        emailEndpoint = `${API}/api/contact-blog-author`
    }
    else {
        emailEndpoint = `${API}/api/contact`
    }
    return fetch(`${emailEndpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};