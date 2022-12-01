import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'


function CreatePledge() {
  const [pledge, updatePledge] = useState();
  const designerEmail = window.sessionStorage.getItem('designerEmail');
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

  const attemptCreate = () => {
    const cost = document.getElementById('cost').value;
    if (cost === '') {
      document.getElementById('message').innerHTML = 'Please enter a pledge cost.';
      return false;
    }
    const description = document.getElementById('description').value;
    const maxSupporters = document.getElementById('maxSupporters').value;

    const body = {};
    body['cost'] = cost;
    body['description'] = description;
    body['maxSupporters'] = maxSupporters;
    body['designerEmail'] = designerEmail;
    body['projectName'] = projectName;
    const data = { 'body': JSON.stringify(body) }
    aws.post('/createPledge', data)
    .then(response => {
        //change this depending on how the actual aws.post responds.. currently mock adapter does:
        /*
            mockAws.onPost('/createPledge')
            .reply(200, {
            body: {
                'cost': 10.00,
                'description': '',
                'maxSupporters': 10,
                'supporters': []
            }
            })
        */
        if (response.data.statusCode === 200) {
            const pledge = response.data.body;
            updatePledge(pledge);
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

  if (typeof pledge === 'undefined') { // has not created a pledge yet
      return (
          <>
          <Header loggedIn={ true } />
          <h1>Create project</h1>
          <Form.Group controlId='cost'>
              <Form.Label>Pledge cost</Form.Label>
              <Form.Control type='number' placeholder='Pledge cost' autoComplete='off' />
          </Form.Group>

          <Form.Group controlId='description'>
              <Form.Label>Description (optional)</Form.Label>
              <Form.Control type='text' placeholder='Description (optional)' autoComplete='off' />
          </Form.Group>

          <Form.Group controlId='maxSupporters'>
              <Form.Label>Max supporters (optional)</Form.Label>
              <Form.Control type='number' placeholder='Max supporters (optional)' autoComplete='off' /> 
          </Form.Group>

          <Button onClick={attemptCreate}>
              Create pledge
          </Button>
          <p id='message'>&nbsp;</p>
          </>
      )
  }

  else return ( // pledge created, return to project information page
      <>
      <Navigate 
          to={'/viewProject'} />
      </>
  )
}
  
export default CreatePledge;