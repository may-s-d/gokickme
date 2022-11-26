import { Container, Nav, Navbar, NavLink } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const rightButtons = (props) => {
    if (props.showAccountButtons !== false && props.loggedIn === false) {
        return (
            <Nav className="justify-content-end">
                <NavLink href='/registerDesigner'>Register designer</NavLink>
                <NavLink href='/login'>Login</NavLink>
                <NavLink href='/designerHomepage'>Designer homepage</NavLink> { /* (for testing, remove when everything linked correctly) */ }
            </Nav>
        )
    }
}

export default function Header(props) {
    return (
      <>
        <Navbar bg='dark' variant='dark'>
            <Container>
                <Navbar.Brand href='/'>GoKickMe</Navbar.Brand>
                { rightButtons(props) }
            </Container>
        </Navbar>
      </>
    );
  }