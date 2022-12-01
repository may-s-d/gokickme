import  { Navigate } from 'react-router-dom';
import Header from '../components/Header.js'

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

    else return (
        <>
        <Header loggedIn={ false }/>
        <p>You made it to homepage v1.0.1</p>
        </>
    );
  }
  
  export default Index;
  