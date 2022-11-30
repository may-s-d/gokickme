import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import  { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'

function DesignerHomepage() {
    const designer = JSON.parse(window.sessionStorage.getItem('designer'));
    const [projects, updateProjects] = useState();
    const getProjects = () => {
        const body = {};
        body['email'] = designer.email;
        const data = { 'body': JSON.stringify(body) }
        aws.post('/designerProjects', data)
        .then(response => {
            const p = response.data.body.projects;
            updateProjects( { projects: p });
        })
    }
    
    const renderProjects = () => {
        const projects = designer.projects;
        const renderedProjects = projects.map((project, index) => {
            return (
                <Container key={index}>
                    { project.projectName }
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
            logged in: { designer.email }
            { renderProjects() }
        </Container>
        </>
    );
  }
  
  export default DesignerHomepage;
  