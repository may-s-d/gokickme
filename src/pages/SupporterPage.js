import { Navigate } from 'react-router-dom';

function SupporterPage(props) {
    const supporterEmail = window.sessionStorage.getItem('supporterEmail');
    if (supporterEmail === null) {
        return (
            <Navigate 
            to={'/login'}
            state={{ error: `Please login as a supporter to view that page.` }} />
        );
    }
    else return props.page;
}

export default SupporterPage;