import { Button, Container } from 'react-bootstrap';
import  { Navigate, useLocation } from 'react-router-dom';

import Header from '../components/Header.js'
function DesignerHomepage(props) {
    const loc = useLocation();
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
        <Header loggedIn={ true }/>
        <Button href='/createProject'>Create new project</Button>
        <Container>
            here there would be the projects, but i couldn't remember if we wanted to change the GUI since our mockup, so i didn't put a layout here. we'll figure it out later. lol
        </Container>
        </>
    );
  }
  
  export default DesignerHomepage;
  