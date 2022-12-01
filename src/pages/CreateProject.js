import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'


function CreateProject() {
  const [projects, updateProjects] = useState();
  const designerEmail = JSON.parse(window.sessionStorage.getItem('designerEmail'));

  const attemptCreate = () => {
    const name = document.getElementById('name').value;
    if (name === '') {
      document.getElementById('message').innerHTML = 'Please enter a project name.';
      return false;
    }

    const story = document.getElementById('story').value;
    if (story === '') {
        document.getElementById('message').innerHTML = 'Please enter a project story.';
        return false;
    }

    const type = document.getElementById('type').value;
    
    const amount = document.getElementById('amount').value;
    if (amount === '' || amount < 0) {
        document.getElementById('message').innerHTML = 'Please enter a valid project amount.';
        return false;
    }
  
    const deadline = document.getElementById('deadline').value;
    if (deadline === '') {
        document.getElementById('message').innerHTML = 'Please enter a project deadline.';
        return false;
    }


    else {
      const body = {};
      body['name'] = name;
      body['story'] = story;
      body['type'] = type;
      body['amount'] = amount;
      body['deadline'] = deadline;
      body['designerEmail'] = designerEmail;
      const data = { 'body': JSON.stringify(body) }
      console.log(data);
      aws.post('/createProject', data)
      .then(response => {
        const projects = response.data.body.projects;
        updateProjects(projects);
      }).catch(error => {
        console.log(error);
        document.getElementById('message').innerHTML = name + ` is already in use.`;
        return false;
        }
      )
    }
  }

  if (typeof projects === 'undefined') { // has not created a project yet
      return (
          <>
          <Header loggedIn={ true } />
          <h1>Create project</h1>
          <Form.Group controlId='name'>
              <Form.Label>Project name</Form.Label>
              <Form.Control type='text' placeholder='Project name' autoComplete='off' />
          </Form.Group>

          <Form.Group controlId='story'>
              <Form.Label>Story</Form.Label>
              <Form.Control type='text' placeholder='Story' autoComplete='off' />
          </Form.Group>

          <Form.Group controlId='type'>
              <Form.Label>Type</Form.Label>
              <Form.Select>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
              </Form.Select>
          </Form.Group>

          <Form.Group controlId='amount'>
              <Form.Label>Goal amount</Form.Label>
              <Form.Control type='number' placeholder='Amount' autoComplete='off' /> 
          </Form.Group>
          
          <Form.Group controlId="deadline">
              <Form.Label>Deadline</Form.Label>
              <Form.Control type="date" placeholder="Deadline" />
          </Form.Group>

          <Button onClick={attemptCreate}>
              Create project
          </Button>
          <p id='message'>&nbsp;</p>
          </>
      )
  }

  else return (
      <>
      <Navigate 
          to={'/designerHomepage'} />
      </>
  )
}
  
export default CreateProject;