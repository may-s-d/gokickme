import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js';


function RegisterDesigner(props) {
  const [state, updateState] = useState();

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
      const body = {};
      body['email'] = email;
      body['name'] = name;
      const data = { 'body': JSON.stringify(body) }
      aws.post('/registerDesigner', data)
      .then(response => {
        const designer = response.data.body.designer;
        window.sessionStorage.setItem('designer', JSON.stringify(designer));
        updateState( { designer: designer });
      }).catch(error => {
        console.log(error);
        document.getElementById('message').innerHTML = email + ` is already in use.`
        return false;
        }
      )
    }
  }

  if (typeof state === 'undefined') {
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
        <p>If you already have an account, <a href='/login'>login here</a>.</p>
      </>
    );
  }

  else return (
    <>
        <Navigate 
            to={'/designerHomepage'}
            state={{ designer: state.designer }}
        />
    </>
  )
}

export default RegisterDesigner;