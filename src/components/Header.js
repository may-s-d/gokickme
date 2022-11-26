import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const rightButtons = (props) => {
    if (props.showAccountButtons !== false && props.loggedIn === false) {
        return (
            <Nav className="justify-content-end">
                <Link to='/registerDesigner'>
                    <Button>Register designer</Button>
                </Link>
                <Link to='/login'>
                    <Button>Login</Button>
                </Link>
            </Nav>
        )
    }
}

export default function Header(props) {
    return (
      <>
        <Nav>
            <Link to='/'>
                <Button>Home</Button>
            </Link>
        </Nav>
        { rightButtons(props) }
        
      </>
    );
  }