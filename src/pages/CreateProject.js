import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import Header from '../components/Header.js'

const createprojecturl = ''; // same deal

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
      const data = {};
      data['name'] = name;
      data['story'] = story;
      data['type'] = type;
      data['amount'] = amount;
      data['deadline'] = deadline;
      data['designer'] = ''; // NEED TO BE ABLE TO GET THE DESIGNER WHO'S LOGGED IN
      let xhr = new XMLHttpRequest();
      xhr.open('POST', createprojecturl, true);
      xhr.send(JSON.stringify(data));
  
      xhr.onload = () => {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200) {
            // login
          }
          else {
            // error. will probably do extra bits, but this works for now
            document.getElementById('message').innerHTML = name + ` is already a project name.`;
          }
        }
      };
    }
  }


function DesignerHomepage(props) {
    return (
        <>
        <Header loggedIn={ true }/>
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
    );
  }
  
  export default DesignerHomepage;