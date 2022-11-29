import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'

function AdminHomepage() {
    const [projects, updateProjects] = useState();
    const getProjects = () => {
        aws.get('/adminProjects')
        .then(response => {
            const p = response.data.body.projects;
            updateProjects( { projects: p });
        })
    }

    const renderProjects = () => {
        const renderedProjects = projects.projects.map((project, index) => {
            return (
                <Container key={index}>
                    { project.projectName }
                    <Button>Button1</Button> { /* these don't do anything. lol */ }
                    <Button>Button2</Button>
                    <Button>Button3</Button>
                </Container>
            )
        });
        return renderedProjects;
    }
    if (typeof projects === 'undefined') {
        return (
            <>
                <Header showAccountButtons={ false } loggedIn={ true } />
                <p>Loading projects...</p>
                { getProjects() }
            </>
        )
    }
    else return (
        <>
            <Header showAccountButtons={ false } loggedIn={ true } />
            { renderProjects() }
        </>
    );
}

export default AdminHomepage;