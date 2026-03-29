import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../Components/Header';
import { FcNext, FcPrevious } from "react-icons/fc";
import '../assets/CSS/List.css';
import Footer from '../Components/Footer';

const ListAgent = () => {
    const API = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [signUpData, setsignUpData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const token = localStorage.getItem('token');
    // const role = localStorage.getItem('role');
    const [active, setActive] = useState(false);
    const [supportAgentData, setSupportAgentData] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedSupportAgent, setSelectedSupportAgent] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCounts, setVisibleCounts] = useState(10);

    //Fetch the Sub admin list
    const fetchSupportAgent = async () => {
        try {
            const res = await axios.get(`${API}/agent/get-support-agent`, {headers: {Authorization: `Bearer ${token}`}});
            setSupportAgentData(res?.data?.data || []);
            console.log("fetched Support Agent", res.data.data);
        }
        catch (error) {
            console.log(error, "Something went wrong");
        }
    }
    //Validate sign up form for Sub Admin
    const validateSignUpForm = () => {
        let newErrors = {};
        if (!signUpData.firstName.trim()) newErrors.firstName = "First Name is required";
        if (!signUpData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!signUpData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        if (!signUpData.email.trim()) newErrors.email = "Email is required";
        if (!signUpData.password.trim()) newErrors.password = "Password is required";
        if (!signUpData.confirmPassword.trim()) newErrors.confirmPassword = "Confirm Password is required";
        if (signUpData.password && signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword) newErrors.confirmPassword = "Password do not match";
        setError(newErrors);
        return Object.keys(newErrors).length === 0
    }
    //Handle submit for Sign up and Edit the Sub Admin
    const handleSubmitSignUp = async (e) => {
        e.preventDefault();
        if (!validateSignUpForm()) return;
        try {
            if (selectedSupportAgent) {
                const response = await axios.put(`${API}/agent/create-support-agent/${selectedSupportAgent._id}`, signUpData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(response, "Support Agent Updated successfully");
                toast.success("Support Agent Updated successfully !");
                setsignUpData({
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                })
            }
            else {
                const response = await axios.post(`${API}/agent/create-support-agent`, signUpData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(response, "Support Agent created successfully");
                toast.success("Support Agent created successfully !");
                setsignUpData({
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                })
            }
            await fetchSupportAgent();
            closePopUp();
        }
        catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("server issue")
            }
            console.log(error, "Something went wrong");
        }
    }
    //Delete the Sub Admin
    const handlesupportAgentDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Support Agent")) return;
        try {
            await axios.delete(`${API}/agent/delete-support-agent/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Support Agent deleted successfully");
            setSupportAgentData(supportAgentData.filter(supportAgent => supportAgent._id !== id));
        }
        catch (error) {
            if (error) {
                toast.error(error.response?.data?.message || "Server Error");
            }
            else {
                toast.error("server error");
            }
            console.log(error, "Something went wrong");
        }
    }
    //search the sub Admin
    const searchSub = supportAgentData.filter((data) => {
        const text = (data.firstName + " " + data.lastName + data.email).toLowerCase();
        return text.includes(search.toLowerCase());
    })
    //initially visible count for admin of 5 list
    const lastIndexOfSubAdmin = currentPage * visibleCounts;
    const firstIndexOfSubAdmin = lastIndexOfSubAdmin - visibleCounts;
    //  const visibleSubAdmin = searchSub.slice(0, visibleCounts);
     const visibleSubAdmin = searchSub.slice(firstIndexOfSubAdmin , lastIndexOfSubAdmin);

        let pages = [];
        for(let i=1; i <= Math.ceil(searchSub.length / visibleCounts); i++){
            pages.push(i);
        }
        //when the search result are showing 5 list will reset
        useEffect(() => {
            setCurrentPage(1);
        }, [search])
        useEffect(()=> {
            window.scrollTo({
                top: 0,
                behavior:"smooth",
            });
        }, [currentPage])
    //This will run when Edit Button clicked and Existing data will show in sign up edit form
    useEffect(() => {
        if (id) {
            const getSupportAgent = async () => {
                try {
                    const res = await axios.get(`${API}/agent/get-support-agent/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    setsignUpData({
                        firstName: res.data.data.firstName || "",
                        lastName: res.data.data.lastName || "",
                        phoneNumber: res.data.data.phoneNumber || "",
                        email: res.data.data.email || "",
                        password: "",
                        confirmPassword: "",
                    });
                    console.log("data", res.data.data);
                }
                catch (error) {
                    console.log(error);
                    toast.error(error.response.data.error);
                }
            }
            getSupportAgent();
        }

    }, [id, token]);
    //Pop up will close and existing data will reset
    const closePopUp = () => {
        setActive(false);
        setSelectedSupportAgent(null);
        setsignUpData({ firstName: "", lastName: "", phoneNumber: "", email: "", password: "", confirmPassword: "", })
    }
    //Fetch the sub Admin List 
    useEffect(() => {
        fetchSupportAgent();
    }, [])

    useEffect(()=> {
        active ? document.body.style.overflow = "hidden" : "auto";
        return ()=> document.body.style.overflow = "auto";
    }, [active]);

    return (
        <>
            <Header/>
            <section className="subAdminSectionNew">
                    <div className="myAdmin" style={{ padding: "20px", width: "100%", justifySelf: "center" }}>
                        <div className="container">
                            <h2 style={{ textAlign: "center", padding: "20px" }}>My Support Agent </h2>
                            <div className="countSearch" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", padding: "9px 0px" }}>
                                <div className='subAdminButton'>
                                    <p>Support Agent: {supportAgentData?.length}</p>
                                    <div>
                                        <input type='text' placeholder='Search your sub-Admin' value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "10px 20px" }} />
                                    </div>
                                </div>
                                <button onClick={() => setActive(true)}>Create Support Agent</button>
                            </div>
                            <div>
                                <table style={{ border: "1px solid", width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ borderBottom: "1px solid grey" }}>Name</th>
                                            <th style={{ borderBottom: "1px solid grey" }}>Phone Number</th>
                                            <th style={{ borderBottom: "1px solid grey" }}>Email</th>
                                            <th style={{ borderBottom: "1px solid grey" }}>Password</th>
                                            <th style={{ borderBottom: "1px solid grey" }}>Created At</th>
                                            <th style={{ borderBottom: "1px solid grey" }} colSpan={2}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleSubAdmin.length === 0 ?
                                            (<tr><td colSpan="5">No results found</td></tr>) : (visibleSubAdmin.map((subAdmin) => (
                                                <tr key={subAdmin?._id}>
                                                    <td style={{ borderBottom: "1px solid grey" }}>{subAdmin?.firstName} {subAdmin?.lastName}</td>
                                                    <td style={{ borderBottom: "1px solid grey" }}>{subAdmin?.phoneNumber}</td>
                                                    <td style={{ borderBottom: "1px solid grey" }}>{subAdmin?.email}</td>
                                                    <td style={{ borderBottom: "1px solid grey" }}>****</td>
                                                    <td style={{ borderBottom: "1px solid grey" }}>{subAdmin?.createdAt?.split("T")[0]?.split("-").reverse().join("/")}</td>
                                                    <td><button className='update' onClick={() => { setSelectedSupportAgent(subAdmin); setsignUpData({ firstName: subAdmin.firstName || "", lastName: subAdmin.lastName || "", phoneNumber: subAdmin.phoneNumber || "", email: subAdmin.email || "", password: "", confirmPassword: "", }); setActive(true); }}>Edit</button></td>
                                                    <td style={{ borderBottom: "1px solid grey" }}>
                                                        <button style={{ padding: "5px 20px", marginBottom: "5px", backgroundColor: "red", border: "none", cursor: "pointer", borderRadius: "5px" }} onClick={() => handlesupportAgentDelete(subAdmin?._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            )))}
                                    </tbody>
                                </table>
                                <div className="pagination">
                                    <div className="countSubAdmin">
                                        <p><span>{visibleSubAdmin.length}</span> of <span>{supportAgentData.length}</span> Support Agent</p>
                                    </div>
                                    <div className="buttonPagination">
                                    <button disabled={currentPage === 1} onClick={()=> setCurrentPage(currentPage - 1)}><FcPrevious /></button>
                                    {pages.map((page, index) => {
                                        return <button key={index} onClick={()=> setCurrentPage(page)} className={`paginationNumber ${currentPage === page ? "activePage" : ""}`}>{page} </button>
                                    })}
                                    <button disabled={currentPage === pages.length || pages.length === 0} onClick={()=> setCurrentPage(currentPage + 1)}><FcNext /></button>  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
            <Footer/>
            {active && (
                <div className="popUpoverLay" onClick={() => setActive(false)}>
                    <div className="modalBox" onClick={(e) => e.stopPropagation()}>
                        <h1>{selectedSupportAgent ? "Edit for Support Agent" : "Sign up for Support Agent"}</h1><button className='closeButton' onClick={closePopUp}>✕</button>
                        <form onSubmit={handleSubmitSignUp}>
                            <input placeholder='First Name' value={signUpData.firstName} onChange={(e) => { setsignUpData({ ...signUpData, firstName: e.target.value }); setError({ ...error, firstName: '' }); }} />
                            {error.firstName && <p className="signUpError">{error.firstName}</p>}
                            <input placeholder='Last Name' value={signUpData.lastName} onChange={(e) => { setsignUpData({ ...signUpData, lastName: e.target.value }); setError({ ...error, lastName: '' }); }} />
                            {error.lastName && <p className="signUpError">{error.lastName}</p>}
                            <input placeholder='Phone Number' type='tel' value={signUpData.phoneNumber} onChange={(e) => { setsignUpData({ ...signUpData, phoneNumber: e.target.value }); setError({ ...error, phoneNumber: '' }); }} />
                            {error.phoneNumber && <p className="signUpError">{error.phoneNumber}</p>}
                            <input placeholder='Email' type='email' value={signUpData.email} onChange={(e) => { setsignUpData({ ...signUpData, email: e.target.value }); setError({ ...error, email: '' }); }} />
                            {error.email && <p className="signUpError">{error.email}</p>}
                            <input placeholder='Password' type='password' value={signUpData.password} onChange={(e) => { setsignUpData({ ...signUpData, password: e.target.value }); setError({ ...error, password: '' }); }} />
                            {error.password && <p className="signUpError">{error.password}</p>}
                            <input placeholder='Confirm Password' type='password' value={signUpData.confirmPassword} onChange={(e) => { setsignUpData({ ...signUpData, confirmPassword: e.target.value }); setError({ ...error, confirmPassword: '' }); }} />
                            {error.confirmPassword && <p className="signUpError">{error.confirmPassword}</p>}
                            <button type='submit'>{selectedSupportAgent ? "UPDATE" : "SIGN UP"}</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default ListAgent
