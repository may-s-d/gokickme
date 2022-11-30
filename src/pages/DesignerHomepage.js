import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import  { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'

function DesignerHomepage() {
    const [projects, updateProjects] = useState();
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

    
    const  attemptProjectView = (e) => {
        console.log(e.currentTarget.id)
    }

    const attemptDeleteProject = (e) => {
        console.log(e.currentTarget.id)
    }

    const renderProjects = () => {
        const renderedProjects = projects.map((project, index) => {
            return (
                <Container key={index}>
                    { project.projectName }
                    <Button id={project.projectName} onClick={attemptProjectView}>View</Button>
                    <Button id={project.projectName} onClick={attemptDeleteProject}>Delete</Button>
                </Container>
            )
        });
        return renderedProjects;
    }

    if (typeof projects === 'undefined') {
        return (
            <>
            <Header loggedIn={ true } />
            <p>Loading projects...</p>
            { getProjects() }
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
  