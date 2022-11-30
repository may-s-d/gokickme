// this file is just to handle redirecting to login if 
// someone tries to access a designer page but isn't logged in as a designer
import { Navigate } from 'react-router-dom';

function DesignerPage(props) {
    const designerEmail = window.sessionStorage.getItem('designerEmail');
    if (designerEmail === null) {
        return (
            <Navigate 
            to={'/login'}
            state={{ error: `Please login as a designer to view that page.` }} />
        );
    }
    else return props.page;
}

export default DesignerPage;