import { useState } from 'react';
import { APP_NAME } from '../config';
import Link from 'next/link';
import Router from 'next/router';
import { logout, isAuth } from '../actions/auth';
import NProgress from 'nprogress';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    NavLink,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';
import '.././node_modules/nprogress/nprogress.css';
Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.done()
const Header = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="light" light expand="md">
                <Link href="/"><NavLink className='font-weight-bold'>{APP_NAME}</NavLink></Link>

                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>

                        <React.Fragment>
                            <NavItem>
                                <Link href="/blogs" >
                                    <NavLink style={{ cursor: 'pointer' }}>Blogs</NavLink>
                                </Link>
                            </NavItem>
                        </React.Fragment>


                        {!isAuth() && (<React.Fragment>
                            <NavItem>
                                <Link href="/signup" >
                                    <NavLink style={{ cursor: 'pointer' }}>Sign Up</NavLink>
                                </Link>
                            </NavItem>

                            <NavItem>
                                <Link href="/login" >
                                    <NavLink style={{ cursor: 'pointer' }}>Login</NavLink>
                                </Link>
                            </NavItem>
                        </React.Fragment>)}
                        {isAuth() && (<NavItem>
                            <NavLink style={{ cursor: 'pointer' }} onClick={() =>
                                logout(() => {
                                    Router.replace(`/login`)
                                })
                            }>
                                Logout</NavLink>
                        </NavItem>)}
                    </Nav>
                    <NavbarText>Simple Text</NavbarText>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default Header;