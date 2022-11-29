import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { Navigate, useLocation } from 'react-router-dom';
import { aws } from '../AWS.js';

import Header from '../components/Header.js'

function Login(props) {
  const [state, updateState] = useState();

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
          console.log(designer);
          updateState( { designer: designer });
        }
        else if (typeof response.data.body.supporter !== 'undefined') {
          const supporter = response.data.body.supporter;
          console.log(supporter);
          // do some stuff here to redirect to supporterHomepage
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
  const loc = useLocation();
  if (loc.state !== null && loc.state.error !== 'undefined') {
    msg = loc.state.error;
  }

  if (typeof state === 'undefined') { // means no user logged in/user doesn't exist
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

  else if (typeof state.designer !== 'undefined') { // are we logging into a designer account
    return (
      <>
          <Navigate 
              to={'/designerHomepage'}
              state={{ designer: state.designer }}
          />
      </>
    )
  }
  
  else if (typeof state.supporter !== 'undefined') {
    // supporter account
  }
}

export default Login;
