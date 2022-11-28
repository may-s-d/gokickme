import { Container, Nav, Navbar, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const home = (props) => { 
    // because normal homepage, designer homepage, and supporter homepage are separate pages,
    // need to make sure that GoKickMe links to the right one depending on who's logged in
    let route = '/';
    let state = undefined;
    if (typeof props.designer !== 'undefined') {
        route = '/designerHomepage';
        state = { designer: props.designer };
    }

    else if (typeof props.supporter !== 'undefined') {
        route = '/supporterHomepage';
        state = { supporter: props.supporter };
    }
    return (
        <Navbar.Brand
        as={ Link }
        to={ route }
        state= { state }>
            GoKickMe
        </Navbar.Brand>
    )
}

const rightButtons = (props) => {
    if (props.showAccountButtons !== false && props.loggedIn === false) {
        return (
            <Nav className="justify-content-end">
                <NavLink href='/registerDesigner'>Register designer</NavLink>
                <NavLink href='/login'>Login</NavLink>
            </Nav>
        )
    }
}

export default function Header(props) {
    return (
      <>
        <Navbar bg='dark' variant='dark'>
            <Container>
                { home(props) }
                { rightButtons(props) }
            </Container>
        </Navbar>
      </>
    );
  }