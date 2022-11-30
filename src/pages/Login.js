import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { Navigate, useLocation } from 'react-router-dom';
import { aws } from '../AWS.js';

import Header from '../components/Header.js'

function Login() {
  const [state, updateState] = useState(0);
  const designer = window.sessionStorage.getItem('designer');
  const supporter = window.sessionStorage.getItem('supporter');
  const admin = window.sessionStorage.getItem('admin');

  const attemptLogin = () => {
    const email = document.getElementById('email').value;
    if (email === '') {
      document.getElementById('message').innerHTML = 'Please enter an email address.';
      return false;
    }
    else {
      const body = {};
      body['email'] = email;
      const data = { 'body': JSON.stringify(body) }

      aws.post('/login', data)
      .then(response => {
        if (typeof response.data.body.designer !== 'undefined') {
          const designer = response.data.body.designer;
          window.sessionStorage.setItem('designer', JSON.stringify(designer));
          updateState(state => state += 1);
        }
        else if (typeof response.data.body.supporter !== 'undefined') {
          // do some stuff here similar to designer
        }
      }).catch(error => {
        console.log(error);
        document.getElementById('message').innerHTML = email + ` isn't a valid account.`;
        return false;
        }
      )
    }
  }

  let msg = ' ';
  const loc = useLocation(); // still needs this bc passes errors as state
  if (loc.state !== null && loc.state.error !== 'undefined') {
    msg = loc.state.error;
  }

  if (designer !== null || supporter !== null || admin !== null) { // user already logged in. App.js handles which homepage to redirect to
    console.log('already logged in');
    return (
      <>
      <Navigate
      to={'/designerHomepage'} />
      </>
    )
  }

  else return (
    <>
      <Header showAccountButtons={ false } loggedIn={ false }/>
      <h1>Log in</h1>
      <Form.Group controlId='email'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='Email' autoComplete='off' />
      </Form.Group>

      <Button onClick={ attemptLogin }>
          Log In
      </Button>
      <p id='message'>{ msg }</p>
      <p>If you don't already have an account, <a href='/registerDesigner'>register here</a>.</p>
    </>
  );
}

export default Login;
