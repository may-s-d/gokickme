import { Navigate } from 'react-router-dom';

function AdminPage(props) {
    const adminEmail = 'hardcoding this to work';
    window.sessionStorage.setItem('adminEmail', adminEmail);
    // const adminEmail = window.sessionStorage.getItem('adminEmail');
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