import { Button, Container } from 'react-bootstrap';
import  { Link, Navigate, useLocation } from 'react-router-dom';

import Header from '../components/Header.js'

function DesignerHomepage(props) { 
    const renderProjects = () => {
        const projects = loc.state.designer.projects;
        console.log(projects);
        const renderedProjects = projects.map((project, index) => {
            return (
                <Container key={index}>
                    { project.projectName }
                    <Button>Button1</Button> { /* these don't do anything. lol */ }
                    <Button>Button2</Button>
                    <Button>Button3</Button>
                </Container>
            )
        });
        return (
            renderedProjects
        )
    }

    const loc = useLocation();
    console.log(loc);
    if (loc.state === null || typeof loc.state.designer === 'undefined') {
        return (
            <>
                <Navigate 
                    to={'/login'}
                    state={{ error: `Please login to view that page.` }}
                />
            </>
        )
    }

    else return (
        <>
        <Header loggedIn={ true } designer={ loc.state.designer }/>
        <Button 
        as={ Link }
        to='/createProject'
        state={ { designer: loc.state.designer } }>Create new project</Button>
        <Container>
            logged in: { loc.state.designer.email }
            { renderProjects() }
        </Container>
        </>
    );
  }
  
  export default DesignerHomepage;
  