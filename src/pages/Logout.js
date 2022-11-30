import  { Navigate } from 'react-router-dom';

function Logout() {
    window.sessionStorage.clear();
    console.log('session storage cleared');
    return (
        <>
        <Navigate to='/' />
        </>
    )
}

export default Logout;

    