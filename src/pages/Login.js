import { Button, Form } from 'react-bootstrap';
import  { Navigate, useLocation } from 'react-router-dom';

import Header from '../components/Header.js'

const loginurl = ''; // THIS IS NOT DEFINED YET. TO ADD WHEN WE HAVE IT

const attemptLogin = () => {
  const email = document.getElementById('email').value;
  if (email === '') {
    document.getElementById('message').innerHTML = 'Please enter an email address.';
    return false;
  }
  else {
    const data = {};
    data['email'] = email;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', loginurl, true);
    xhr.send(JSON.stringify(data));

    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          <Navigate 
            to={'/designerHomepage'}
            state={{ designer: JSON.parse(xhr.response).designer }}
          />
        }
        else {
          // error. will probably do extra bits, but this works for now
          document.getElementById('message').innerHTML = email + ` isn't a valid account.`;
        }
      }
    };
  }
}

function Login(props) {
  let msg = ' ';
  const loc = useLocation();
  if (loc.state !== null && loc.state.error !== 'undefined') {
    msg = loc.state.error;
  }
  return (
    <>
      <Header showAccountButtons={ false } loggedIn={ false }/>
      <h1>Log in</h1>
      <Form.Group controlId='email'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='Email' autoComplete='off' />
      </Form.Group>

      <Button onClick={attemptLogin}>
          Log In
      </Button>
      <p id='message'>{ msg }</p>
      <p>If you don't already have an account, <a href='/registerDesigner'>register here</a>.</p>
    </>
  );
}

export default Login;
