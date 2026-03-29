import React from 'react';
import '../assets/Common/Footer.css';
import { FaFacebook, FaLinkedin } from 'react-icons/fa6';
import { SlSocialInstagram } from 'react-icons/sl';
import { BsGithub } from 'react-icons/bs';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footerContent">
                    <div className="logo">
                        <div className="logoImage">
                           <h3>Lead Portal</h3>
                        </div>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum cum veniam est error sunt sed.</p>
                    </div>
                    <div className="left">
                        <ul>
                            <li>About Us</li>
                            <li>Blogs</li>
                            <li>Career</li>
                        </ul>
                        <ul>
                            <li>Contact Us</li>
                            <li>FAQ</li>
                            <li>Support</li>
                        </ul>
                    </div>
                    <div className="right">
                        <p>Connect with us</p>
                        <div className="social">
                            <FaFacebook />
                            <FaLinkedin />
                            <SlSocialInstagram />
                            <BsGithub />
                        </div>
                        <ul>
                            <li>Terms & Conditions</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                </div>
                <div className="bottom">
                    <p>@2026 Lead Portal. All rights reserved</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
