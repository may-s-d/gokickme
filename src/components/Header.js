import { Container, Nav, NavDropdown, Navbar, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function Header(props) {
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