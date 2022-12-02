import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js';
import $ from 'jquery';

function Register() {
  const [state, updateState] = useState(0);

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
      const userType = $("input[type='radio'][name='User']:checked")[0].value;
      const body = {};
      body['email'] = email;
      body['name'] = name;
      const data = { 'body': JSON.stringify(body) }
      const url = '/register' + userType;
      aws.post(url, data)
      .then(response => {
        if (response.data.statusCode === 200) {
          const userEmail = response.data.body.email;
          const key = userType.toLowerCase() + 'Email';
          window.sessionStorage.setItem(key, userEmail);
          updateState(state => state += 1);
        }
        else {
          document.getElementById('message').innerHTML = response.data.body;
        }
      }).catch(error => {
        console.log(error);
        document.getElementById('message').innerHTML = email + ` is already in use.`
        return false;
        }
      )
    }
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

  return (
    <>
      <Header showAccountButtons={ false } loggedIn={ false }/>
      <h1>Register designer</h1>
      <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='text' placeholder='Email' autoComplete='off' />
      </Form.Group>
      <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' placeholder='Name' autoComplete='off' />
      </Form.Group>
      <Form.Group controlId='user'>
        <Form.Label>User</Form.Label>
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
    </Form.Group>

      <Button onClick={attemptRegister}>
          Register
      </Button>
      <p id='message'>&nbsp;</p>
      <p>If you already have an account, <a href='/login'>login here</a>.</p>
    </>
  );
}

export default Register;