import { useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import  { Navigate, useLocation } from 'react-router-dom';
import { aws } from '../AWS.js';
import $ from 'jquery';

import Header from '../components/Header.js'

function Login() {
  const [state, updateState] = useState(0);

  const attemptLogin = () => {
    const email = document.getElementById('email').value;
    if (email === '') {
      document.getElementById('message').innerHTML = 'Please enter an email address.';
      return false;
    }
    const userType = $("input[type='radio'][name='User']:checked")[0].value;
    const body = {};
    body['email'] = email;
    const data = { 'body': JSON.stringify(body) }
    console.log(data);
    const url = '/login' + userType;
    aws.post(url, data)
    .then(response => {
      console.log(response);
      if (response.data.statusCode === 200) {
        const user = response.data.body;
        const key = userType.toLowerCase() + 'Email';
        console.log(user);
        window.sessionStorage.setItem(key, user.email);
        updateState(state => state += 1);
      }
      else {
        document.getElementById('message').innerHTML = response.data.body;
      }
      
    }).catch(error => {
      console.log(error);
      document.getElementById('message').innerHTML = email + ` isn't a valid account.`;
      return false;
      }
    )
    
  }

  let msg = String.fromCharCode(160);
  const loc = useLocation(); // still needs this bc passes errors as state
  if (loc.state !== null && loc.state.error !== 'undefined') {
    msg = loc.state.error;
  }
  
  const designerEmail = window.sessionStorage.getItem('designerEmail');
  if (designerEmail !== null) {
    return (
      <>
      <Navigate
      to={'/designerHomepage'} />
      </>
    )
  }

  const supporterEmail = window.sessionStorage.getItem('supporterEmail');
  if (supporterEmail !== null) {
    return (
      <>
      <Navigate
      to={'/supporterHomepage'} />
      </>
    )
  }

  const adminEmail = window.sessionStorage.getItem('adminEmail');
  if (adminEmail !== null) {
    return (
      <>
      <Navigate
      to={'/adminHomepage'} />
      </>
    )
  }

  else return (
    <>
      <Header showAccountButtons={ false } loggedIn={ false }/>
      <h1>Log in</h1>
      <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='text' placeholder='Email' autoComplete='off' />
      </Form.Group>
      <Form.Group controlId='user'>
          <Row><Form.Label>User</Form.Label></Row>
          <Form.Check
            inline
            label='Designer'
            name='User'
            type='radio'
            value='Designer'
            id={`inline-radio-2`}
            defaultChecked={true}
          />
          <Form.Check
            inline
            label='Supporter'
            name='User'
            type='radio'
            value='Supporter'
            id={`inline-radio-2`}
          />
          <Form.Check
            inline
            label='Admin'
            name='User'
            type='radio'
            value='Admin'
            id={`inline-radio-2`}
          />
      </Form.Group>

      <Button onClick={ attemptLogin }>
          Log In
      </Button>
      <p id='message'>{ msg }</p>
      <p>If you don't already have an account, <a href='/register'>register here</a>.</p>
    </>
  );
}

export default Login;
