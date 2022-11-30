import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import  { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'

const projectName = window.sessionStorage.getItem("projectName")
const designerEmail = JSON.parse(window.sessionStorage.getItem('designerEmail'));

const [project, updateProject] = useState();

function ViewProject() {
    console.log(projectName)

    const getProject = () => {
        const body = {};
        body['designerEmail'] = designerEmail;
        body['projectName'] = projectName;
        const data = { 'body': JSON.stringify(body) }
        aws.get('/viewProject', data)
        .then(response => {
            const project = response.data.body.project;
            updateProject(project);
        })
    }

    const renderProject = () => {
        return (
            <Container id={project.projectName} key={index}>
                { project.projectName }
                <Button onClick={attemptProjectView}>View</Button>
                <Button onClick={attemptDeleteProject}>Delete</Button>
            </Container>
        )
    }

    if (typeof projects === 'undefined') {
        return (
            <>
            <Header loggedIn={ true } />
            <p>Loading projects...</p>
            { getProject() }
            </>
        )
    }

    else if(!(typeof project === 'undefined')) {
        return (
            <>
                <Navigate 
                    to={'/viewProject'}
                />
            </>
        )
    }

    else return (
        <>
        <Header loggedIn={ true } />
        <Container>
            logged in: { designerEmail }
            { renderProject() }
        </Container>
        </>
    );
  }





export default ViewProject