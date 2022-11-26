import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index.js';
import Login from './pages/Login.js';
import RegisterDesigner from './pages/RegisterDesigner.js'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/login' element={ <Login /> } />
          <Route path='/registerDesigner' element={ <RegisterDesigner /> } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
