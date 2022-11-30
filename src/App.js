import { useState } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Index from './pages/Index.js';
import Login from './pages/Login.js';
import RegisterDesigner from './pages/RegisterDesigner.js';
import DesignerHomepage from './pages/DesignerHomepage.js';
import CreateProject from './pages/CreateProject.js';
import AdminHomepage from './pages/AdminHomepage.js';


function App() {
  let designer = window.sessionStorage.getItem('designer');
  let supporter = window.sessionStorage.getItem('supporter');
  let admin = window.sessionStorage.getItem('admin');

  const homepage = () => {
    if (designer !== null) {
      console.log('designer')
      return <DesignerHomepage />;
    }
    else if (supporter !== null) {
      // return <SupporterHomepage />;
    }
    else if (admin !== null) {
      return <AdminHomepage />;
    }
    
    else {
      console.log('main');
      return <Index />;
    }
  }

  const designerPage = (page) => {
    if (typeof designer === 'undefined') {
      console.log('undefined')
      return (
        <Navigate 
        to={'/login'}
        state={{ error: `Please login as a designer to view that page.` }} />
        )
    }
    else return page;
  }

  // const supporterPage = (page) => {
  //   if (typeof supporter === 'undefined') {
  //     return (
  //       <Navigate 
  //       to={'/login'}
  //       state={{ error: `Please login as a supporter to view that page.` }} />
  //       )
  //   }
  //   else return page;
  // }

  const adminPage = (page) => {
    if (typeof admin === 'undefined') {
      return (
        <Navigate 
        to={'/login'}
        state={{ error: `Please login as an admin to view that page.` }} />
        )
    }
    else return page;
  }

  const logout = () => {
    window.sessionStorage.clear();
    return (
      <Navigate 
      to={'/'} />
    )
  }
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ homepage() } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/registerDesigner' element={ <RegisterDesigner /> } />
          <Route path='/designerHomepage' element={ designerPage(<DesignerHomepage />) } />
          <Route path='/createProject' element={ designerPage(<CreateProject />) } />
          <Route path='/adminHomepage' element={ adminPage(<AdminHomepage />) } />
          <Route path='/logout' element={ logout() } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
