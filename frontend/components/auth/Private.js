import { Fragment, useEffect } from 'react';
import Router from 'next/router';
import { isAuth } from '../../actions/auth';

const Private = ({ children }) => {

    useEffect(() => {
        if (!isAuth()) {
            Router.push(`/login`)
        }
    }, [])
    return <Fragment>{children}</Fragment>
}

export default Private