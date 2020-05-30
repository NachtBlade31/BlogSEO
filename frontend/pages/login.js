import Layout from '../components/Layout';
import { withRouter } from 'next/router'
import LoginComponent from '../components/auth/LoginComponent';
import Link from 'next/link';
const Login = ({ router }) => {
    const showRedirectMessage = () => {
        if (router.query.message) {
            return <div className="alert alert-danger">
                {router.query.message}
            </div>
        }
        else {
            return;
        }
    }
    return (
        <Layout>
            <h2 className='text-center pt-4 pb-4'>Log into your Account</h2>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {showRedirectMessage()}
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <LoginComponent />
                </div>
            </div>
        </Layout>
    )
}

export default withRouter(Login);  