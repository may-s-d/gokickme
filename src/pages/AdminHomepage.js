import { useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
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
        const calculateTimeLeft = (deadline) => {
            let today = Date.parse(new Date())
            let amongus = Date.parse(deadline)
            return Math.floor((amongus - today) / 86400000)
        }
        const attemptDeleteProject = (e) => {
            const projectName = e.currentTarget.parentNode.parentNode.id;
            const body = {};
            body['adminEmail'] = adminEmail;
            body['projectName'] = projectName;
            const data = { 'body': JSON.stringify(body) }
            console.log(data);
            aws.post('/adminDeleteProject', data)
            .then(response => {
                if (response.data.statusCode === 200) {
                    updateProjects(undefined); // forces reload
                }
                else {
                    console.log(response.data.body);
                }
            })
            .catch(console.log);
        }
        const deleteButton = <Button variant='danger' onClick={attemptDeleteProject}>Delete</Button>;
        const renderedProjects = projects.map((project, index) => {
            console.log(project);
            return (
                <tr key={index} id={project.name}>
                    <td>{ project.name }</td>
                    <td>{ project.status }</td>
                    <td>{ project.type }</td>
                    <td>${ project.goal_amount }</td>
                    <td>{ calculateTimeLeft(project.deadline) } days</td>
                    <td>{ deleteButton }</td>
                    <td></td>
                </tr>
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
                <Table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Status</td>
                            <td>Type</td>
                            <td>Goal amount</td>
                            <td>Time left</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        { renderProjects() }
                    </tbody>
                </Table>
            </Container>
        </>
    )}
}

export default AdminHomepage;