import { useState } from 'react';
import { Button, Card, Container, Table } from 'react-bootstrap';
import  { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'

function ViewProject() {
    const projectName = window.sessionStorage.getItem('projectName');
    const designerEmail = window.sessionStorage.getItem('designerEmail');
    const supporterEmail = window.sessionStorage.getItem('supporterEmail')

    const [project, updateProject] = useState();

    const getProject = () => {
        const body = {};
        body['designerEmail'] = designerEmail;
        body['projectName'] = projectName;
        const data = { 'body': JSON.stringify(body) }
        console.log(data);
        aws.post('/viewProject', data)
        .then(response => {
            if (response.data.statusCode === 200) {
                const project = response.data.body;
                console.log(project)
                updateProject(project);
            }
            else {
              console.log(response.data.body);
            }
        })
    }

    const renderProject = () => {
        return (
            <Container id={project.name}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <Card style={{ width: '60%' }}>
                            <Card.Body>
                            <Card.Title>Project name: {project.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Designer: {project.designer_email}</Card.Subtitle>
                            <Card.Text>Story: {project.story}</Card.Text>
                            </Card.Body>
                        </Card>
                    <Card style={{ width: '40%' }}>
                        <Card.Body>
                            <Card.Text>${project.totalFunded} raised out of  ${project.goal_amount} goal</Card.Text>
                            <Card.Text>Deadline: {project.deadline}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        )
    }

    const renderPledges = () => {
        
        const renderedPledges = project.pledges.map((pledge, index) => {
            return (
                <tr key={index}>
                    {/* <h2>Pledge {index + 1}</h2> */}
                    <td>${pledge.cost}</td>
                    <td>{pledge.description}</td>
                    <td>{pledge.maxSupporters}</td>
                    <td><Button variant='danger'>Delete</Button></td>
                </tr>
            )
        })
        return (
            <Table>
                <thead>
                    <tr>
                        <th style={{width:'10%'}}>Cost</th>
                        <th style={{width:'70%'}}>Description</th>
                        <th style={{width:'10%'}}>Max Supporters</th>
                        <th style={{width: '10%'}}></th>
                    </tr>
                </thead>
                <tbody>
                    { renderedPledges }
                </tbody>
            </Table>
        )
    }

    if (typeof project === 'undefined') {
        return (
            <>
            <Header loggedIn={ true } />
            <p>Loading project...</p>
            { getProject() }
            </>
        )
    }

    else return (
        <>
        <Header loggedIn={ true } />
        <Button 
        as={ Link }
        to='/designerHomepage'
        size='sm'>
            {"← Back to Projects"}</Button>
            
        <Container>
            <p>logged in: { designerEmail }</p>
            { renderProject() }
        </Container>
        <Container>
            <Button 
            as={ Link }
            to='/createPledge'>
                Create new pledge
            </Button>
            <Card>
                <Card.Body>
                    {renderPledges()}
                </Card.Body>
            </Card>
        </Container>
        
        </>
    );
  }

export default ViewProject