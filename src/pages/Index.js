import  { Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from '../components/Header.js';
import Kick from '../assets/kick-cartoon.gif';

function Index() {
    const designerEmail = window.sessionStorage.getItem('designerEmail');
    const supporterEmail = window.sessionStorage.getItem('supporterEmail');
    const adminEmail = window.sessionStorage.getItem('adminEmail');
    if (designerEmail !== null) {
        return (
            <Navigate 
            to={'/designerHomepage'}/>
        );
    }
    else if (supporterEmail !== null) {
        return (
            <Navigate 
            to={'/supporterHomepage'}/>
        );
    }
    else if (adminEmail !== null) {
        return (
            <Navigate 
            to={'/adminHomepage'}/>
        );
    }

    else {
        console.log("v1.0.4")
        return (
        <>
        <Header loggedIn={ false } />
        <Container>
            <img src={Kick} alt='Kick' width='50%' />
        </Container>
        </>
    )}
  }
  
  export default Index;
  