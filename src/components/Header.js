import { Container, Nav, Navbar, NavLink } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function Header(props) {
    const homepage = () => {
        let designer = window.sessionStorage.getItem('designer');
        let supporter = window.sessionStorage.getItem('supporter');
        let admin = window.sessionStorage.getItem('admin');
        if (designer !== null) {
            return (
                <>
                <Navigate
                to={'/designerHomepage'} />
                </>
            )
        }
        else if (supporter !== null) {
            return (
                <>
                <Navigate
                to={'/supporterHomepage'} />
                </>
            )
        }

        else if (admin !== null) {
            return (
                <>
                <Navigate
                to={'/adminHomepage'} />
                </>
            )
        }

        else return (
            <>
            <Navigate
            to={'/'} />
            </>
        )
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
        // else if (props.showAccountButtons !== false && props.loggedIn === true) {
        //     return (
        //         <Nav className='justify-content-end'>
        //             <NavLink href='/logout'>Logout</NavLink>
        //         </Nav>
        //     )
        // }
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