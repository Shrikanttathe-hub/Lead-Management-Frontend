import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import axios from 'axios';
import '../assets/CSS/Home.css';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const [data, setData] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const fetchData = () => {
    setLoading(true);
    axios.get(`${API}/lead/lead-list`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setLoading(false);
        setData(res?.data?.data);
        console.log("Leads List fetched", res?.data?.data);
      })
      .catch((err) => {
        console.log("error", err.message);
        setLoading(false);
      })
  }
  useEffect(() => {
    fetchData();
  }, [token])
  return (
    <>
      <Header />
      <section className='home'>
        <div className="container">
          <h1>Dashboard</h1>
          <div className="cardSection">
            {loading ? (<h3>Loading...</h3>) : (
            <>
              <div className="card">
                <p>Total Leads <span></span></p>
                <strong>{data?.length}</strong>
              </div>
                <div className="card">
                <p>Total New Leads <span style={{backgroundColor:"darkgreen"}}></span></p>
                <strong>{data.filter((item)=> item.status === "New").length || "0"}</strong>
              </div>
              <div className="card">
                <p>Total Qualified Leads <span style={{backgroundColor:"Yellow"}}></span></p>
                <strong>{data.filter((item)=> item.status === "Qualified").length}</strong>
              </div>
              <div className="card">
                <p>Total Won Leads <span style={{backgroundColor:"orange"}}></span></p>
                <strong>{data.filter((item)=> item.status === "Won").length || "0"}</strong>
              </div>
               <div className="card">
                <p>Total Hot Leads <span style={{backgroundColor:"tomato"}}></span></p>
                <strong>{data.filter((item)=> item.status === "Hot").length || "0"}</strong>
              </div>
                <div className="card">
                <p>Total Contacted Leads <span style={{backgroundColor:"darkgray"}}></span></p>
                <strong>{data.filter((item)=> item.status === "Contacted").length || "0"}</strong>
              </div>
               <div className="card">
                <p>Total Lost Leads <span style={{backgroundColor:"red"}}></span></p>
                <strong>{data.filter((item)=> item.status === "Lost").length || "0"}</strong>
              </div>
                 <div className="card">
                <p>Total Assigened Leads <span style={{backgroundColor:"grey"}}></span></p>
                <strong>{data.filter((item)=> item.assigned !== null).length || "0"}</strong>
              </div>   
            </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Home