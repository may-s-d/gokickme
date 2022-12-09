import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'


function AddFunds() {
  const [counter, updateCounter] = useState(0);
  const supporterEmail = window.sessionStorage.getItem('supporterEmail');

  const attemptAdd = () => {
    const funds = document.getElementById('funds').value;
    if (funds === '' || funds <= 0) {
      document.getElementById('message').innerHTML = 'Please enter a funds amount.';
      return false;
    }

    const body = {};
    body['amount'] = funds;
    body['supporterEmail'] = supporterEmail;
    const data = { 'body': JSON.stringify(body) }
    console.log(data);
    aws.post('/addFunds', data)
    .then(response => {
        if (response.data.statusCode === 200) {
            updateCounter(counter => counter+1);
        }
        else {
            console.log(response.data.body);
        }
    })
    .catch(error => {
        console.log(error);
        document.getElementById('message').innerHTML = 'Something went wrong.';
        return false;
    })
  }

  if (counter === 0) { // has not added funds yet
      return (
          <>
          <Header loggedIn={ true } showAccountButtons={false} />
          <h1>Add funds</h1>
          <Form.Group controlId='funds'>
              <Form.Label>Add funds to your account</Form.Label>
              <Form.Control type='number' placeholder='Funds' autoComplete='off' />
          </Form.Group>

          <Button onClick={attemptAdd}>
              Add funds
          </Button>
          <p id='message'>&nbsp;</p>
          </>
      )
  }

  else return ( // pledge created, return to project information page
      <>
      <Navigate 
          to={'/'} />
      </>
  )
}
  
export default AddFunds;