import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import DesignerHomepage from './pages/DesignerHomepage.js';
import CreateProject from './pages/CreateProject.js';
import AdminHomepage from './pages/AdminHomepage.js';
import SupporterHomepage from './pages/SupporterHomepage.js';
import Logout from './pages/Logout.js'
import CreatePledge from './pages/CreatePledge.js';
import DesignerPage from './pages/DesignerPage.js';
import SupporterPage from './pages/SupporterPage.js';
import AdminPage from './pages/AdminPage.js';
import ViewProject from './pages/ViewProject.js';
import AddFunds from './pages/AddFunds.js';
import DirectDonation from './pages/DirectDonation.js';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Index /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/register' element={ <Register /> } />
          <Route path='/designerHomepage' element={ <DesignerPage page=<DesignerHomepage /> /> } />
          <Route path='/createProject' element={ <DesignerPage page=<CreateProject /> /> } />
          <Route path='/adminHomepage' element={ <AdminPage page=<AdminHomepage /> /> } />
          <Route path='/supporterHomepage' element= { <SupporterPage page=<SupporterHomepage /> /> } />
          <Route path='/logout' element={ <Logout /> } />
          <Route path='/createPledge' element={ <DesignerPage page=<CreatePledge /> /> } />
          <Route path='/viewProject' element={ <ViewProject /> } />
          <Route path='/addFunds' element={ <SupporterPage page=<AddFunds /> /> } />
          <Route path='/directDonation' element={ <SupporterPage page=<DirectDonation /> /> } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
