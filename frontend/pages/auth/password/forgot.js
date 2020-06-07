import { useState, Fragment } from 'react'
import Layout from '../../../components/Layout'
import { forgotPassword } from '../../../actions/auth'


const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: '',
        message: '',
        error: '',
        showForm: true
    })

    const { email, message, error, showForm } = values

    const handleChange = name => e => {
        setValues({ ...values, message: '', error: '', [name]: e.target.value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        setValues({ ...values, message: '', error: '' })
        forgotPassword({ email }).then(data => {
            console.log(data)
            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                setValues({
                    ...values,
                    message: data.message,
                    email: '',
                    showForm: false
                })
            }
        })
    }
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '')
    const showMessage = () => (message ? <div className="alert alert-success">{message}</div> : '')


    const passwordPasswordForm = () => {
        return (
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group pt-5">
                        <input type="email" onChange={handleChange('email')} className="form-control" value={email} placeholder="Enter your Email" required />
                    </div>
                    <div>
                        <button className="btn btn-primary">
                            Forgot Password
                    </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <Layout>
            <div className="container">
                <h2>
                    Forgot Password
                </h2>
                {showError()}
                {showMessage()}
                {showForm && passwordPasswordForm()}
            </div>
        </Layout>
    )
}

export default ForgotPassword;