import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'


function CreatePledge() {
  const [project, updateProject] = useState();
  const designerEmail = JSON.parse(window.sessionStorage.getItem('designerEmail'));
  const projectName = JSON.parse(window.sessionStorage.getItem('projectName'));

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
        const project = response.data.body.project;
        updateProject(project);
    })
    .catch(error => {
        console.log(error);
        document.getElementById('message').innerHTML = 'Something went wrong.';
        return false;
        }
    )
  }

  if (typeof project === 'undefined') { // has not created a pledge yet
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

  else return (
      <>
      <Navigate 
          to={'/viewProject'} />
      </>
  )
}
  
export default CreatePledge;