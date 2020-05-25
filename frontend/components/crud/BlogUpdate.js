import Link from 'next/link';
import { Fragment, useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { singleBlog, updateBlog } from '../../actions/blog';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import '../../node_modules/react-quill/dist/quill.snow.css';
import { Quillmodules, Quillformats } from '../../helpers/quill';
import { API } from '../../config';

const BlogUpdate = ({ router }) => {
    const [body, setBody] = useState('')
    const [values, setValues] = useState({
        title: '',
        error: '',
        success: '',
        formData: '',
        hidePublishButton: false
    })
    const { title, error, success, formData } = values
    const { slug } = router.query;
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [checked, setChecked] = useState([])
    const [checkedTag, setCheckedTag] = useState([])
    const token = getCookie('token')
    useEffect(() => {
        setValues({ ...values, formData: new FormData() })
        initBlog();
        initCategories();
        initTags();
    }, [router])

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCategories(data)
            }
        })
    }
    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setTags(data)
            }
        })

    }
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    )

    const setCategoriesinArray = blogCategories => {
        let ca = []
        blogCategories.map((category, index) => {
            ca.push(category._id)
        })
        setChecked(ca)
    }

    const setTagsinArray = blogTags => {
        let ta = []
        blogTags.map((tag, index) => {
            ta.push(tag._id)
        })
        setCheckedTag(ta)
    }

    const initBlog = () => {
        if (slug) {
            singleBlog(slug).then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    setValues({ ...values, title: data.title })
                    setBody(data.body)
                    setCategoriesinArray(data.categories)
                    setTagsinArray(data.tags)
                }
            })
        }
    }
    const handleBody = e => {
        setBody(e)
        formData.set('body', e)
    }
    const editBlog = (e) => {
        e.preventDefault()
        updateBlog(formData, token, slug).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                setValues({ ...values, title: '', success: `Blog titled ${data.title} is successfully updated` })
                if (isAuth() && isAuth().role === 1) {
                    Router.replace(`/admin`)
                }
                else if (isAuth() && isAuth().role === 0) {
                    Router.replace(`/user`)
                }
            }
        })
    }
    const handleChange = name => e => {
        //console.log(e.target.value);
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        formData.set(name, value)
        setValues({ ...values, [name]: value, formData, error: '' })

    }
    const handleToggle = (c) => () => {
        setValues({ ...values, error: '' })

        //return the first index or -1
        const clickedCategory = checked.indexOf(c)
        const all = [...checked]
        if (clickedCategory === -1) {
            all.push(c)
        } else {
            all.splice(clickedCategory, 1)
        }
        setChecked(all)
        formData.set('categories', all)
    }

    const handleTagToggle = (c) => () => {
        setValues({ ...values, error: '' })

        //return the first index or -1
        const clickedTag = checkedTag.indexOf(c)
        const all = [...checkedTag]
        if (clickedTag === -1) {
            all.push(c)
        } else {
            all.splice(clickedTag, 1)
        }
        setCheckedTag(all)
        formData.set('tags', all)
    }

    const findOutCategory = c => {
        const result = checked.indexOf(c)
        if (result !== -1) {
            return true
        }
        else {
            return false
        }
    }

    const findOutTags = t => {
        const result = checkedTag.indexOf(t)
        if (result !== -1) {
            return true
        }
        else {
            return false
        }
    }

    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleToggle(c._id)} checked={findOutCategory(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleTagToggle(c._id)} checked={findOutTags(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }
    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog} >
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" onChange={handleChange('title')} value={title} />
                </div>

                <div className="form-group">
                    <ReactQuill modules={Quillmodules} formats={Quillformats} value={body} placeholder="Write Something Amazing...." onChange={handleBody} />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </div>
            </form>
        )
    }
    return <div className="container-fluid pb-5">

        <div className="row">
            <div className="col-md-8">
                {updateBlogForm()}
                <div className="pt-3">
                    {showError()}
                    {showSuccess()}
                </div>
                {body && <img className="img img-fluid" style={{ maxHeight: 'auto', width: '100%' }} src={`${API}/api/blog/photo/${slug}`} alt={title} />}

                <hr />
            </div>


            <div className="col-md-4">
                <div>
                    <div className="form-group pb-2">
                        <h5>Featured Image</h5>
                        <hr />
                        <small className="text-muted pr-4">Max Size:1mb</small>
                        <label className="btn btn-outline-info">Upload Featured Image
                        <input type="file" accept="image/*" onChange={handleChange('photo')} hidden /></label>
                    </div>
                </div>
                <div>
                    <h5>Categories</h5>
                    <hr />
                    <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showCategories()}</ul>
                </div>

                <div>
                    <h5>Tags</h5>
                    <hr />
                    <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
                </div>

            </div>
        </div>



    </div>

}

export default withRouter(BlogUpdate)