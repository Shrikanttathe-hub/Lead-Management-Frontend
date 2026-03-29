import { useState } from 'react';
import './App.css';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import SuperAdminProfile from './Pages/superAdminProfile';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './Pages/Home';
import Contact from './Pages/Contact';
import About from './Pages/About';
import "react-toastify/dist/ReactToastify.css";
import List from './Pages/List';
import ListAgent from './Pages/ListAgent';
import Lead from './Pages/Lead';
import ProtectedRoutes from './Pages/ProtectedRoute';

function App() {

  return (
    <>
      <ToastContainer style={{ zIndex: "9999999" }} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/contact-us' element={<Contact />} />
        <Route path='/about-us' element={<About />} />
        <Route element={<ProtectedRoutes />}>
           <Route path='/super-admin-profile' element={<SuperAdminProfile />} />
           <Route path='/lead-page' element={<Lead />} />
          <Route path='/sub-admin-list' element={<List />} />
          <Route path='/support-agent-list' element={<ListAgent />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
