import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'


function DirectDonation() {
  const [counter, updateCounter] = useState(0);
  const supporterEmail = window.sessionStorage.getItem('supporterEmail');
  const projectName = window.sessionStorage.getItem('projectName');

  if (projectName === null) {
    console.log(`project doesn't exist`);
    return (
        <>
        <Navigate 
            to={'/designerHomepage'} />
        </>
    )
  }

  const attemptDonate = () => {
    const amount = document.getElementById('amount').value;
    if (amount === '' || amount <= 0) {
      document.getElementById('message').innerHTML = 'Please enter a donation amount.';
      return false;
    }

    const body = {};
    body['amount'] = amount;
    body['supporterEmail'] = supporterEmail;
    body['projectName'] = projectName;
    const data = { 'body': JSON.stringify(body) }
    console.log(data);
    aws.post('/directDonation', data)
    .then(response => {
        if (response.data.statusCode === 200) {
            updateCounter(counter => counter+1)
        }
        else {
            console.log(response.data.body);
        }
    })
    .catch(error => {
        console.log(error);
        document.getElementById('message').innerHTML = 'Something went wrong.';
        return false;
        }
    )
  }

  if (counter === 0) { // has not submitted a donation yet
      return (
          <>
          <Header loggedIn={ true } />
          <h1>Make a direct donation</h1>
          <Form.Group controlId='amount'>
              <Form.Label>Amount to donate</Form.Label>
              <Form.Control type='number' placeholder='Amount' autoComplete='off' />
          </Form.Group>

          <Button onClick={attemptDonate}>
              Make a donation
          </Button>
          <p id='message'>&nbsp;</p>
          </>
      )
  }

  else return ( // donated, return to project information page
      <>
      <Navigate 
          to={'/viewProject'} />
      </>
  )
}
  
export default DirectDonation;