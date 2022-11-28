import { Button, Container } from 'react-bootstrap';
import  { Navigate, useLocation } from 'react-router-dom';

import Header from '../components/Header.js'
function DesignerHomepage(props) {
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
        <Header loggedIn={ true }/>
        <Button href='/createProject'>Create new project</Button>
        <Container>
            logged in: { loc.state.designer.email }
        </Container>
        </>
    );
  }
  
  export default DesignerHomepage;
  