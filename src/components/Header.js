import { Container, Nav, Navbar, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function Header(props) {
    const rightButtons = () => { // buttons on right side of screen
        if (props.showAccountButtons !== false && props.loggedIn === false) {
            return (
                <Nav className="justify-content-end">
                    <NavLink href='/registerDesigner'>Register designer</NavLink>
                    <NavLink href='/login'>Login</NavLink>
                    <NavLink href='/adminHomepage'>Admin view</NavLink>
                </Nav>
            );
        }
        else if (props.showAccountButtons !== false && props.loggedIn === true) {
            return (
                <Nav className='justify-content-end'>
                    <NavLink href='/logout'>Logout</NavLink>
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