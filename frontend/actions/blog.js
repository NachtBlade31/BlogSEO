import fetch from 'isomorphic-fetch';
import { API } from '../config';
import queryString from 'query-string'
import { isAuth, handleResponse } from '../actions/auth'
export const createBlog = (blog, token) => {

    let createBlogEndpoint
    if (isAuth() && isAuth().role === 1) {
        createBlogEndpoint = `${API}/api/blog`
    }
    else if (isAuth() && isAuth().role === 0) {
        createBlogEndpoint = `${API}/api/user/blog`
    }
    return fetch(`${createBlogEndpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: blog
    })
        .then(response => {
            handleResponse(response)
            return response.json()
        })
        .catch(err => console.log(err));
};

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
    const data = {
        limit, skip
    }
    return fetch(`${API}/api/blogs-categories-tags`, {
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

export const singleBlog = slug => {
    return fetch(`${API}/api/blog/${slug}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
}

export const listRelated = (blog) => {
    return fetch(`${API}/api/blogs/related`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};

export const list = (username) => {
    let listBlogsEndpoint
    if (username) {
        listBlogsEndpoint = `${API}/api/${username}/blogs`
    }
    else {
        listBlogsEndpoint = `${API}/api/blogs`
    }
    return fetch(`${listBlogsEndpoint}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

export const removeBlog = (slug, token) => {
    let removeBlogsEndpoint
    if (isAuth() && isAuth().role === 1) {
        removeBlogsEndpoint = `${API}/api/blog/${slug}`
    }
    else if (isAuth() && isAuth().role === 0) {
        removeBlogsEndpoint = `${API}/api/user/blog/${slug}`
    }
    return fetch(`${removeBlogsEndpoint}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            handleResponse(response)
            return response.json()
        })
        .catch(err => console.log(err));
};

export const updateBlog = (blog, token, slug) => {
    let updateBlogsEndpoint
    if (isAuth() && isAuth().role === 1) {
        updateBlogsEndpoint = `${API}/api/blog/${slug}`
    }
    else if (isAuth() && isAuth().role === 0) {
        updateBlogsEndpoint = `${API}/api/user/blog/${slug}`
    }
    return fetch(`${updateBlogsEndpoint}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: blog
    })
        .then(response => {
            handleResponse(response)
            return response.json()
        })
        .catch(err => console.log(err));
};

export const listSearch = (params) => {
    console.log('search params', params)
    let query = queryString.stringify(params)
    console.log('query params', query)
    return fetch(`${API}/api/blogs/search?${query}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};