import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'



function ViewProject() {
    const projectName = window.sessionStorage.getItem("projectName")
    const designerEmail = JSON.parse(window.sessionStorage.getItem('designerEmail'));

    const [project, updateProject] = useState();
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
            <Container id={project.projectName}>
                <h1>project.projectName</h1>
                <h1>project.designerEmail</h1>
            </Container>
        )
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
        <Container>
            logged in: { designerEmail }
            { renderProject() }
        </Container>
        </>
    );
  }

export default ViewProject