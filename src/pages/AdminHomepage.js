import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'

function AdminHomepage() {
    const adminEmail = window.sessionStorage.getItem('adminEmail');
    const [projects, updateProjects] = useState();
    const getProjects = () => {
        aws.post('/adminProjects')
        .then(response => {
            if (response.data.statusCode === 200) {
                const projects = response.data.body;
                updateProjects(projects); // forces page refresh
            }
            else {
              console.log(response.data.body);
            }
        })
    }

    const renderProjects = () => {
        const renderedProjects = projects.map((project, index) => {
            return (
                <Container key={index}>
                    { project.name }
                </Container>
            )
        });
        return renderedProjects;
    }
    if (typeof projects === 'undefined') { // shows this until projects fetched
        return (
            <>
                <Header showAccountButtons={ true } loggedIn={ true } />
                <p>Loading projects...</p>
                { getProjects() }
            </>
        )
    }
    else {
        const attemptReap = () => {
            const body = {};
            body['date'] = new Date();
            body['adminEmail'] = adminEmail;
            const data = { 'body': JSON.stringify(body) }
            aws.post('/reapProject', data)
            .then(response => {
                if (response.data.statusCode === 200) {
                    updateProjects(undefined); // force update
                }
                else {
                console.log(response.data.body);
                }
            })
        }
        return (
        <>
            <Header showAccountButtons={ true } loggedIn={ true } />
            <Container>
            <Button variant='danger' onClick={attemptReap}>Reap projects</Button>
            { renderProjects() }
            </Container>
        </>
    )}
}

export default AdminHomepage;