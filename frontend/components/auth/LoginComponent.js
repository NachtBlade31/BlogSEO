import { useState, useEffect } from 'react';
import { login, authenticate, isAuth } from '../../actions/auth';
import Router from 'next/router';
import Link from 'next/link';

const LoginComponent = () => {

    useEffect(() => {
        isAuth() && Router.push(`/`);
    }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    const { name, email, password, error, loading, showForm, message } = formData;

    function handleChange(e) {
        setFormData({ ...formData, error: false, [e.target.name]: e.target.value })


    }
    const handleSubmit = async e => {
        e.preventDefault();

        // console.table({ name, email, password, error, loading, showForm })

        setFormData({ ...formData, loading: true, error: false, loading: false })
        const user = { email, password }
        login(user)
            .then(data => {
                if (data.error) {
                    setFormData({ ...formData, error: data.error })
                }
                else {
                    //save user token to cookie
                    //save user info to localstorage
                    //authenticate user

                    authenticate(data, () => {

                        if (isAuth() && isAuth().role === 1) {
                            Router.push(`/admin`);
                        }
                        else {
                            Router.push(`/user`);
                        }

                    })

                }
            })
    };

    const showLoading = () => (loading ? <div className='alert alert-info'>Loading....</div> : '');
    const showError = () => (error ? <div className='alert alert-danger'>{error}</div> : '');
    const showMessage = () => (message ? <div className='alert alert-info'>{message}</div> : '');


    const loginForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input name='email' value={email} onChange={handleChange} type="email" className="form-control" placeholder="Enter Your Email" />
                </div>

                <div className="form-group">
                    <input name='password' value={password} onChange={handleChange} type="password" className="form-control" placeholder="Enter Your Password" />
                </div>

                <div>
                    <button className="btn btn-primary">Login</button>
                </div>
            </form>
        );

    };
    return (
        <React.Fragment>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && loginForm()}
            <hr />
            <Link href="/auth/password/forgot">
                <a className="btn btn-outline-danger btn-sm">Reset Password</a>
            </Link>
        </React.Fragment>)

};


export default LoginComponent