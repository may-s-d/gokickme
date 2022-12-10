import { useState } from 'react';
import { Container, Nav, NavDropdown, Navbar, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import 'bootstrap/dist/css/bootstrap.css';

export default function Header(props) {
    const [supporter, updateSupporter] = useState();
    const getEmail = () => {
        let email = window.sessionStorage.getItem('designerEmail');
        if (email) return email;
        email = window.sessionStorage.getItem('supporterEmail');
        if (email) return email;
        email = window.sessionStorage.getItem('adminEmail');
        if (email) return email;
        return 'error: no user found in sessionStorage';
    }
    const rightButtons = () => { // buttons on right side of screen
        if (props.showAccountButtons !== false && props.loggedIn === false) {
            return (
                <Nav className="justify-content-end">
                    <NavLink href='/register'>Register</NavLink>
                    <NavLink href='/login'>Login</NavLink>
                </Nav>
            );
        }
        else if (props.showAccountButtons !== false && props.loggedIn === true) {
            const supporterEmail = window.sessionStorage.getItem('supporterEmail');
            if (supporter) {
                const addFunds = <NavDropdown.Item href='/addFunds'>Add funds</NavDropdown.Item>;
                const supporterFunds = <Nav.Item style={{color:'white'}}>Funds: ${supporter.budget}</Nav.Item>
                return (
                    <Nav className='justify-content-end'>
                        {supporterFunds}
                        <NavDropdown 
                        title={ 'Signed in as ' + getEmail() }
                        menuVariant='light'
                        align='end'>
                            {addFunds}
                            <NavDropdown.Item href='/logout'>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                )
            }
            else if (supporterEmail) {
                const body = {};
                body['supporterEmail'] = supporterEmail;
                const data = { 'body': JSON.stringify(body) }   
                aws.post('/supporter', data)
                .then(response => {
                    if (response.data.statusCode === 200) {
                        const supporter = response.data.body
                        updateSupporter(supporter)
                    }
                    else {
                        console.log(response.data.body)
                    }
                })
            }

            return (
                <Nav className='justify-content-end'>
                    <NavDropdown 
                    title={ 'Signed in as ' + getEmail() }
                    menuVariant='light'
                    align='end'>
                        <NavDropdown.Item href='/logout'>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            )
        }
    }

    return (
        <>
        <Navbar bg='dark' variant='dark'>
            <Container>
                { <Navbar.Brand 
                as={ Link }
                to={'/'}>
                    GoKickMe
                </Navbar.Brand>}
                { rightButtons() }
            </Container>
        </Navbar>
        </>
    );
  }