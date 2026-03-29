import React, { useEffect, useState } from 'react'
import Header from '../Components/Header';
import '../assets/CSS/superAdmin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';

const SuperAdminProfile = () => {
  const API = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      if (role === "Super Admin") {
        const response = await axios.get(`${API}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data.data);
        console.log("fetched data", response);
      }
      else if (role === "Sub Admin") {
        const response = await axios.get(`${API}/sub-admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data.data);
        console.log("fetched data", response);
      }
      else {
        const response = await axios.get(`${API}/agent/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data.data);
        console.log("fetched data", response);
      }
    }
    catch (error) {
      console.log(error, "something went wrong", error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [token])

  return (
    <>
      <Header />
      <section className='superAdminProfile'>
        <div className="container">
          <div className="mainContent">
            <div className="profile">
              {loading ? (<p>Loading...</p>) : (
                <>
                  <p>Name:  : {data?.firstName} {data?.lastName} </p>
                  <p>Email: : {data?.email}</p>
                  <p>Phone Number: {data?.phoneNumber} </p>
                  <p>created: {data?.createdAt?.split("T")[0].split("-").reverse().join("/")} </p>
                  <p>Role: {data?.role} </p>
                </>
              )}
            </div>
            {role === "Super Admin" && (<div className="buttonSection">
              <button onClick={() => navigate("/sub-admin-list")}>My Sub Admin</button>
              <button onClick={() => navigate("/support-agent-list")}>My Support Agent</button>
            </div>)}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default SuperAdminProfile
