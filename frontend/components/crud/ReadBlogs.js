import Link from 'next/link';
import { Fragment, useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { list, removeBlog } from '../../actions/blog';
import moment from 'moment';

const ReadBlogs = () => {
    const [blogs, setBlogs] = useState([])
    const [messages, setMessages] = useState('')
    const token = getCookie('token')

    useEffect(() => {
        loadBlogs()
    }, [])

    const loadBlogs = () => {
        list().then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                setBlogs(data)
            }
        })
    }
    const deleteBlog = (slug) => {
        removeBlog(slug, token).then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                setMessages(data.message)
                loadBlogs()
            }
        })
    }

    const deleteConfirm = (slug) => {
        let answer = window.confirm('Are you sure you wanna delete the blog ???')
        if (answer) {
            deleteBlog(slug)
        }
    }
    const showUpdateButton = (blog) => {
        if (isAuth() && isAuth().role === 0) {
            return (
                <Link href={`/user/crud/${blog.slug}`}>
                    <a className="btn btn-sm btn-warning ml-2">Update</a>
                </Link>
            )
        }
        else if (isAuth() && isAuth().role === 1) {
            return (
                <Link href={`/admin/crud/${blog.slug}`}>
                    <a className="btn btn-sm btn-warning ml-2">Update</a>
                </Link>
            )
        }
    }
    const showAllBlogs = () => {
        return blogs.map((blog, index) => {
            return (
                <div key={index} className="pb-5">
                    <h3>{blog.title}</h3>
                    <p className="mark">
                        Written By {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}
                    </p>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug)}>Delete</button>
                    {showUpdateButton(blog)}
                </div>
            )
        })
    }
    return (
        <Fragment>
            <div className="row">
                <div className="col-md-12">
                    {messages && <div className="alert alert-warning">{messages}</div>}
                    {showAllBlogs()}
                </div>
            </div>
        </Fragment>
    )
}

export default ReadBlogs;