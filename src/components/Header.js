import { Container, Nav, Navbar, NavLink } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function Header(props) {
    const homepage = () => {
        const designerEmail = window.sessionStorage.getItem('designerEmail');
        const supporterEmail = window.sessionStorage.getItem('supporterEmail');
        const adminEmail = window.sessionStorage.getItem('adminEmail');
        if (designerEmail !== null) {
            return (
                <>
                <Navigate
                to={'/designerHomepage'} />
                </>
            )
        }
        else if (supporterEmail !== null) {
            return (
                <>
                <Navigate
                to={'/supporterHomepage'} />
                </>
            )
        }

        else if (adminEmail !== null) {
            return (
                <>
                <Navigate
                to={'/adminHomepage'} />
                </>
            )
        }

        else {
            console.log('hi')
            return (
                <>
                <Navigate
                to={'/'} />
                </>
            )
        }
    }
    const rightButtons = () => {
        if (props.showAccountButtons !== false && props.loggedIn === false) {
            return (
                <Nav className="justify-content-end">
                    <NavLink href='/registerDesigner'>Register designer</NavLink>
                    <NavLink href='/login'>Login</NavLink>
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
                to={ homepage }>
                    GoKickMe
                </Navbar.Brand>}
                { rightButtons() }
            </Container>
        </Navbar>
      </>
    );
  }