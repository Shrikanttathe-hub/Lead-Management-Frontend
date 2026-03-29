import React, { useState } from 'react';
import '../assets/Common/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { toast } from 'react-toastify';

const Header = ({search, setSearch}) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success("Log out Successfully!")
    navigate("/");
  }
  return (
    <>
      <header>
        <div className="container">
          <div className="headerContent">
              <Link to="/"><h1>Lead Portal</h1></Link>
              <div className="inputSearch">
                <input type='text' placeholder='Search....' value={search} onChange={(e) => {setSearch(e.target.value)}}/>
              </div>
            <nav>
              <ul>
                <Link to="/"><li>Home</li></Link>
                <Link to="/contact-us"><li>Contact us</li></Link>
                <Link to="/about-us"><li>About</li></Link>
                <Link to="/lead-page"><li>Leads</li></Link>
              </ul>
            </nav>
            <div className='buttonSection'>
              {token ? (
                <>
                <Link to="/super-admin-profile" className='userImageButton'><CgProfile /></Link>
                <button onClick={handleLogout}>Logout</button>
                </>
               ) : (
               <>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/sign-up")}>Sign Up</button>
               </>
                )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
export default Header;
