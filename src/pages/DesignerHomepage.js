import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import  { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import  { Navigate } from 'react-router-dom';
import Header from '../components/Header.js'

function DesignerHomepage() {
    const [projects, updateProjects] = useState();
    const [project, updateProject] = useState();
    const designerEmail = JSON.parse(window.sessionStorage.getItem('designerEmail'));
    
    const getProjects = () => {
        const body = {};
        body['designerEmail'] = designerEmail;
        const data = { 'body': JSON.stringify(body) }
        aws.post('/designerProjects', data)
        .then(response => {
            const projects = response.data.body.projects;
            updateProjects(projects);
        })
    }
    
    const attemptProjectView = (e) => {
        const projectName = e.currentTarget.parentNode.id;
        window.sessionStorage.setItem("projectName", projectName);
        updateProject(projectName);
    }

    const attemptDeleteProject = (e) => {
        console.log(e.currentTarget.parentNode.id); // to add
    }

    const renderProjects = () => {
        const renderedProjects = projects.map((project, index) => {
            return (
                <Container id={project.projectName} key={index}>
                    { project.projectName }
                    <Button onClick={attemptProjectView}>View</Button>
                    <Button onClick={attemptDeleteProject}>Delete</Button>
                </Container>
            )
        });
        return renderedProjects;
    }

    if (typeof projects === 'undefined') { // projects not fetched yet
        return (
            <>
            <Header loggedIn={ true } />
            <p>Loading projects...</p>
            { getProjects() }
            </>
        )
    }

    else if (typeof project !== 'undefined') { /* added project to sessionStorage, 
    continue to viewProject */
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
        <Button 
        as={ Link }
        to='/createProject'>
            Create new project
        </Button>
        <Container>
            logged in: { designerEmail }
            { renderProjects() }
        </Container>
        </>
    );
  }
  
  export default DesignerHomepage;
  