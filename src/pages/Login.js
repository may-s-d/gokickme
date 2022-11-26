import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

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
          // login
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
      <p id='message'>&nbsp;</p>
    </>
  );
}

export default Login;
