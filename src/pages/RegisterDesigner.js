import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import Header from '../components/Header.js'

const dregisterurl = ''; // THIS IS NOT DEFINED YET. TO ADD WHEN WE HAVE IT

const attemptRegister = () => {
  const email = document.getElementById('email').value;
  if (email === '') {
    document.getElementById('message').innerHTML = 'Please enter an email address.';
    return false;
  }
  const name = document.getElementById('name').value;
  if (name === '') {
    document.getElementById('message').innerHTML = 'Please enter a name.';
    return false;
  }
  else {
    const data = {};
    data['email'] = email;
    data['name'] = name;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', dregisterurl, true);
    xhr.send(JSON.stringify(data));

    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          // login
        }
        else {
          // error. will probably do extra bits, but this works for now
          document.getElementById('message').innerHTML = email + ` is already in use.`;
        }
      }
    };
  }
}

function Login(props) {
  return (
    <>
      <Header showAccountButtons={ false } loggedIn={ false }/>
      <h1>Register designer</h1>
      <Form.Group controlId='email'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='Email' autoComplete='off' />
      </Form.Group>
      <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' placeholder='Name' autoComplete='off' />
      </Form.Group>

      <Button onClick={attemptRegister}>
          Register
      </Button>
      <p id='message'>&nbsp;</p>
    </>
  );
}

export default Login;
