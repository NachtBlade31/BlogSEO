import { useState } from 'react';
import { signup } from '../../actions/auth';

const SignupComponent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    const { name, email, password, error, loading, showForm } = formData;

    function handleChange(e) {
        setFormData({ ...formData, error: false, [e.target.name]: e.target.value })


    }
    const handleSubmit = async e => {
        e.preventDefault();

        // console.table({ name, email, password, error, loading, showForm })

        setFormData({ ...formData, loading: true, error: false, loading: false, })
        const user = { name, email, password }
        signup(user)
            .then(data => {
                if (data.error) {
                    setFormData({ ...formData, error: data.error })
                }
                else {
                    setFormData({
                        ...formData,
                        name: '',
                        email: '',
                        password: '',
                        error: '',
                        loading: false,
                        message: data.message,
                        showForm: false
                    })
                }
            })
    };


    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input name='name' value={name} onChange={handleChange} type="text" className="form-control" placeholder="Enter Your Name" />
                </div>

                <div className="form-group">
                    <input name='email' value={email} onChange={handleChange} type="email" className="form-control" placeholder="Enter Your Email" />
                </div>

                <div className="form-group">
                    <input name='password' value={password} onChange={handleChange} type="password" className="form-control" placeholder="Enter Your Password" />
                </div>

                <div>
                    <button className="btn btn-primary">Signup</button>
                </div>
            </form>
        );

    };
    return <React.Fragment>{signupForm()}</React.Fragment>

};


export default SignupComponent