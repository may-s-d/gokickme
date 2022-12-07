import { useState } from 'react';
import { aws } from '../AWS.js';
import { Button, Container, Table } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import Header from '../components/Header.js'

function SupporterHomepage() {
    const [projects, updateProjects] = useState()
    const supporterEmail = window.sessionStorage.getItem('supporterEmail')
    const [project, updateProject] = useState()
    const [supporter, updateSupporter] = useState()

    const getProjects = () => {
        aws.post('/adminProjects') //change this to something that excludes projects that failed :)!
        .then(response => {
            if (response.data.statusCode === 200) {
                const projects = response.data.body
                updateProjects(projects) // forces page refresh
            }
            else {
              console.log(response.data.body)
            }
        })
    }

    const getSupporter = () => {
        const body = {};
        body['supporterEmail'] = supporterEmail;
        const data = { 'body': JSON.stringify(body) }
        aws.post('/supporter', data)
        .then(response => {
            if (response.data.statusCode === 200) {
                const supporter = response.data.body
                updateSupporter(supporter)
            }
            else {
                console.log(response.data.body)
            }
        })
    }

    const attemptProjectView = (e) => {
        const projectName = e.currentTarget.parentNode.parentNode.id;
        window.sessionStorage.setItem("projectName", projectName);
        updateProject(projectName);
    }

    const renderProjects = () => {
        const renderedProjects = projects.map((project, index) => {
            if(project.launched.data[0] === 1) //thank you back end 
            {
                return (
                    <tr id={project.name} key={index}>
                        <td>{ project.name }</td>
                        <td>{ project.status }</td>
                        <td>{ project.type }</td>
                        <td><Button onClick={attemptProjectView}>View</Button></td>
                    </tr>
                )
            }
        })
        return (
            <Table>
                <thead>
                    <tr>
                        <th style={{width:'50%'}}>Project Name</th>
                        <th style={{width:'20%'}}>Status</th>
                        <th style={{width:'20%'}}>Type</th>
                        <th style={{width:'10%'}}></th>
                    </tr>
                </thead>
                <tbody>
                    { renderedProjects }
                </tbody>
            </Table>
        )
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
            
            <Container>
                <p>Budget: </p>
                { renderProjects() }
                { getSupporter() }
            </Container>
            </>
        )
}

export default SupporterHomepage;