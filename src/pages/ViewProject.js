import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import  { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'

function ViewProject() {
    const projectName = window.sessionStorage.getItem("projectName");
    const designerEmail = window.sessionStorage.getItem('designerEmail');

    const [project, updateProject] = useState();
    console.log(projectName)

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
                <h1>Name: {project.name}</h1>
                <h1>Designer: {project.designer_email}</h1>
                <h1>Story: {project.story}</h1>
                <h1>Goal: {project.totalFunded} / {project.goal_amount}</h1>
                <h1>Deadline: {project.deadline}</h1>
            </Container>
        )
    }

    const renderPledges = () => {
        const renderedPledges = project.pledges.map((pledge, index) => {
            return (
                <Container key={index}>
                    <h2>Pledge {index + 1}</h2>
                    <p>Cost: {pledge.cost}</p>
                    <p>Description: {pledge.description}</p>
                    <p>Max Supporters: {pledge.maxSupporters}</p>
                    <Button>Claim Pledge</Button>
                </Container>
            )
        })
        return renderedPledges
    }

    if (typeof project === 'undefined') {
        return (
            <>
            <Header loggedIn={ true } />
            <p>Loading projects...</p>
            { getProject() }
            </>
        )
    }

    else return (
        <>
        <Header loggedIn={ true } />
        <Button 
        as={ Link }
        to='/designerHomepage'>
            {"<-- Back to Project List"}</Button>
        <Container>
            logged in: { designerEmail }
            { renderProject() }
        </Container>
        <Container>
            {renderPledges()}
        </Container>
        <Button 
        as={ Link }
        to='/createPledge'>
            Create new pledge
        </Button>
        </>
    );
  }

export default ViewProject