import { useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import  { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import  { Navigate } from 'react-router-dom';
import Header from '../components/Header.js'

function DesignerHomepage() {
    const [projects, updateProjects] = useState();
    const [project, updateProject] = useState();
    const designerEmail = window.sessionStorage.getItem('designerEmail');
    
    const getProjects = () => {
        const body = {};
        body['designerEmail'] = designerEmail;
        const data = { 'body': JSON.stringify(body) }
        aws.post('/designerProjects', data)
        .then(response => {
            if (response.data.statusCode === 200) {
                const projects = response.data.body;
                updateProjects(projects);
            }
            else {
              console.log(response.data.body);
            }
        })
    }
    
    const attemptProjectView = (e) => {
        const projectName = e.currentTarget.parentNode.parentNode.id;
        window.sessionStorage.setItem("projectName", projectName);
        updateProject(projectName);
    }

    const attemptDeleteProject = (e) => {
        console.log(e.currentTarget.parentNode.parentNode.id); // to add
    }

    const renderProjects = () => {
        const renderedProjects = projects.map((project, index) => {
            return (
                <tr id={project.name} key={index}>
                    <td>{ project.name }</td>
                    <td><Button onClick={attemptProjectView}>View</Button></td>
                    <td><Button onClick={attemptDeleteProject} variant='danger'>Delete</Button></td>
                </tr>
            )
        });
        return (
            <Table>
                <thead>
                    <tr><th className='container-sm'>Project Name</th>
                    <th></th>
                    <th></th></tr>
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
            <p>logged in: { designerEmail }</p>
            <Button 
            as={ Link }
            to='/createProject'>
                Create new project
            </Button>
            { renderProjects() }
        </Container>
        </>
    );
  }
  
  export default DesignerHomepage;
  