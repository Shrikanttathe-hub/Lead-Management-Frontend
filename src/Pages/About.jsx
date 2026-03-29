import React from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

const About = () => {
  return (
   <>
    <Header/>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight:"100vh" }}>
    <h2>About us</h2>
    </div>
    <Footer/>
   </>
  )
}

export default About
