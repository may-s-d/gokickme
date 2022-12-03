import { Navigate } from 'react-router-dom';

function AdminPage(props) {
    /* eventually we will want to have an actual admin login, but for now
    i'll just keep it as hardcoded to log you in as an 'admin' if you try to access
    any admin pages */
    const adminEmail = window.sessionStorage.getItem('adminEmail');
    if (adminEmail === null) {
        return (
            <Navigate 
            to={'/login'}
            state={{ error: `Please login as a admin to view that page.` }} />
        );
    }
    else return props.page;
}

export default AdminPage;