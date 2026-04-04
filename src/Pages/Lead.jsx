import React, { useState } from 'react';
import '../assets/CSS/Lead.css'
import Header from '../Components/Header';

import Footer from '../Components/Footer';
import { PiExportBold } from "react-icons/pi";
import { FaEdit, FaFileImport } from "react-icons/fa";
import { FaPlus, FaRegEye } from 'react-icons/fa6';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { HiDotsVertical } from 'react-icons/hi';
import { MdDeleteForever } from 'react-icons/md';

const Lead = () => {
  const API = import.meta.env.VITE_API_URL;
  const [viewTags, setViewTags] = useState(false);
  const [viewTagsEdit, setViewTagsEdit] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [viewPage, setViewPage] = useState(false);
  const [data, setData] = useState([]);
  const [supportAgentData, setSupportAgentData] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [newTag, setNewTag] = useState("");
  const [updateData, setUpdateData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    status: "New",
    source: "",
    tags: "",
    assigned: "",
    notes: "",
  });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
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
  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...updateData,
        assigned: updateData.assigned || null,
        assignedModel: updateData.assignedModel || null,
        tags: updateData.tags ? updateData.tags.split(",").map(t => t.trim()) : [],
        note: updateData.notes
      };
      const response = await axios.post(`${API}/lead/create`, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Lead Created Successfully");
      setEditActive(false);
      setUpdateData({
        name: "",
        email: "",
        phoneNumber: "",
        status: "New",
        source: "",
        tags: "",
        assigned: "",
        notes: "",
      });
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: updateData.name,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber,
        status: updateData.status,
        source: updateData.source,
        tags: updateData.tags ? updateData.tags.split(",") : [],
        assigned: updateData.assigned || null,
        assignedModel: updateData.assignedModel || null,
        note: updateData.notes
      };
      const response = await axios.put(
        `${API}/lead/lead-single/${selectedLead._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Lead Updated Successfully");
      setEditActive(false);
      setUpdateData({
        name: "",
        email: "",
        phoneNumber: "",
        status: "New",
        source: "",
        tags: "",
        assigned: "",
        notes: "",
      });
      setSelectedLead(null);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(
        `${API}/lead/lead-single/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Lead deleted successfully");
      setData(prev => prev.filter(lead => lead._id !== id));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };
  const fetchSupportAgent = async () => {
    try {
      const res = await axios.get(`${API}/agent/get-support-agent`, { headers: { Authorization: `Bearer ${token}` } });
      setAgents(res?.data?.data || []);
      console.log("fetched Support Agent", res.data.data);
    }
    catch (error) {
      console.log(error, "Something went wrong");
    }
  }
  useEffect(() => {
    fetchSupportAgent();
  }, [editActive])
  const fetchSubAdmin = async () => {
    try {
      const res = await axios.get(`${API}/get-sub-admin`);
      setSupportAgentData(res?.data?.data || []);
      console.log("fetched Sub Admin", res.data.data);
    }
    catch (error) {
      console.log(error, "Something went wrong");
    }
  }

  useEffect(() => {
    fetchSupportAgent();
  }, [viewPage])

  const filteredData = data.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phoneNumber?.includes(search);

    let matchesFilter = true;

    if (filterType === "status") {
      matchesFilter = lead.status === filterValue;
    }

    else if (filterType === "tags") {
      matchesFilter = lead.tags?.some(t => t.name === filterValue);
    }

    else if (filterType === "assigned") {
      matchesFilter = lead.assigned?._id === filterValue;
    }

    else if (filterType === "createdAt") {
      matchesFilter = new Date(lead.createdAt)
        .toLocaleDateString() === filterValue;
    }

    return matchesSearch && matchesFilter;
  });
  const handleExport = () => {
    const exportData = data.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phoneNumber,
      Status: lead.status,
      Source: lead.source,
      Assigned: lead.assigned?.firstName || "Not Assigned",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "Leads.xlsx");
  };
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("Imported Data:", jsonData);

      jsonData.forEach(async (lead) => {
        try {
          await axios.post(
            `${API}/lead/create`,
            {
              name: lead.Name,
              email: lead.Email,
              phoneNumber: lead.Phone,
              status: lead.Status || "New",
              source: lead.Source || "",
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        } catch (err) {
          console.log("Import error", err);
        }
      });

      toast.success("Import completed");
      fetchData();
    };

    reader.readAsArrayBuffer(file);
  };
  useEffect(() => {
    fetchSubAdmin();
  }, [editActive])
  const addNote = async () => {
    if (!selectedLead?._id) {
      return toast.error("No lead selected");
    }
    if (!newTag.trim()) {
      return toast.error("Tag cannot be empty");
    }
    try {
      await axios.post(`${API}/lead/add-tag/${selectedLead._id}`, { tag: newTag }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Tag added");
      setNewTag("");
      setViewTags(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add tag");
    }
  };
  const handleTagChange = (index, value) => {
    const updatedTags = [...selectedLead.tags];
    updatedTags[index] = value;
    setSelectedLead({ ...selectedLead, tags: updatedTags });
  };
 const updateTag = async (oldTag, index) => {
  try {
    const newTag = selectedLead.tags[index];
    if (!newTag.trim()) return toast.error("Tag cannot be empty");
    await axios.put(`${API}/lead/update-tag/${selectedLead._id}`,{ oldTag, newTag },{ headers: { Authorization: `Bearer ${token}` } });
    toast.success("Tag updated");
    const updatedTags = [...selectedLead.tags];
    updatedTags[index] = newTag;
    setSelectedLead({ ...selectedLead, tags: updatedTags });
    setData(prev => prev.map(l => l._id === selectedLead._id ? { ...l, tags: updatedTags }: l ));
    setViewTagsEdit(false);
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};
  const deleteTag = async (tag) => {
    try {
      await axios.delete(`${API}/lead/add-tag/${selectedLead._id}`, { data: { tag }, headers: { Authorization: `Bearer ${token}` } });
      toast.success("Tag deleted");
      const updatedTags = selectedLead.tags.filter(t => t !== tag);
      setSelectedLead({ ...selectedLead, tags: updatedTags });
      setData(prev => prev.map(l => l._id === selectedLead._id ? { ...l, tags: updatedTags } : l))
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <Header />
      <section className='leadSection'>
        <div className="container">
          <h2>Leads...</h2>
          <div className="leadContent">
            <div className="topbar">
              <div className="serachbar">
                <input placeholder='Search your Leads here...' value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="filter">
                <div className="custom-select">
                  <label htmlFor="leadByFilter">Filter</label>
                  <select onChange={(e) => { setFilterType(e.target.value); setFilterValue("") }}>
                    <option value="">All</option>
                    <option value="status">Status</option>
                    <option value="tags">Tags</option>
                    <option value="createdAt">By Date</option>
                    <option value="assigned">Assigned Agent</option>
                  </select>
                  {filterType === "status" && (
                    <select onChange={(e) => setFilterValue(e.target.value)}>
                      <option value="">Select Status</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                      <option value="Won">Won</option>
                    </select>
                  )}

                  {filterType === "assigned" && (
                    <select onChange={(e) => setFilterValue(e.target.value)}>
                      <option value="">Select Agent</option>
                      {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>
                          {agent.firstName}
                        </option>
                      ))}
                    </select>
                  )}

                  {filterType === "tags" && (
                    <input
                      placeholder="Enter tag"
                      onChange={(e) => setFilterValue(e.target.value)}
                    />
                  )}
                </div>
              </div>
              <div className="exportButtton">
                <button onClick={handleExport}><PiExportBold />Export</button>
              </div>
              <div className="ImportButtton">
                <label className="importBtn">
                  <FaFileImport /> Import
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    hidden
                    onChange={handleImport}
                  />
                </label>
              </div>
              <div className="AddLeadButtton">
                <button onClick={() => setEditActive(true)}> <FaPlus /> Add Lead</button>
              </div>
            </div>
            <div className="bottomContent">
              <table>
                <thead>
                  <tr>
                    <th><input type='checkbox' /></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Tags</th>
                    <th>Notes</th>
                    <th>Assigned To</th>
                    <th colSpan={3}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (<tr style={{ height: "300px" }}><td colSpan={12}>Leads Loading....</td></tr>) : (filteredData.length === 0 ? (<tr style={{ height: "300px" }}><td colSpan={12}>No Leads Created yet....</td></tr>) : (filteredData.map((leads) => (
                    <tr key={leads._id}>
                      <td><input type='checkbox' /></td>
                      <td>{leads?.name}</td>
                      <td>{leads?.email}</td>
                      <td>{leads?.phoneNumber}</td>
                      <td>{leads?.source}</td>
                      <td className={`status ${leads?.status === "New" ? "status-new" : leads?.status === "Contacted" ? "status-contacted" : leads?.status === "Qualified" ? "status-qualified" : leads?.status === "Lost" ? "status-lost" : leads?.status === "Won" ? "status-won" : ""}`}><span>{leads?.status}</span></td>
                      <td >{leads.tags.length > 0 ? (leads?.tags?.map((tag, index) => (<React.Fragment key={index}><span className='tagChip'>{tag}</span></React.Fragment>))) : (<span>Click to add</span>)}<button className='tagBtn' onClick={() => { setSelectedLead(leads); setViewTags(true) }}><FaPlus /></button>{leads.tags.length > 0 ? (<button className='threeDot' onClick={() => { setSelectedLead(leads); setViewTagsEdit(true) }}><HiDotsVertical /></button>) : ("")}</td>
                      <td>
                        {leads?.notes?.length > 0 ? (
                          <>
                            {leads.notes[leads.notes.length - 1].message}
                            <br />
                            <strong>
                              {new Date(leads.notes[leads.notes.length - 1].createdAt)
                                .toLocaleString()}
                            </strong>
                          </>
                        ) : (<span>No Notes</span>)}
                      </td>
                      <td>{leads?.assigned?.firstName + " " + leads?.assigned?.lastName || "Not assigned"}</td>
                      <td><button className='eye' onClick={() => { setSelectedLead(leads); setViewPage(true) }}><FaRegEye /></button></td>
                      <td><button
                        className='edit'
                        onClick={() => {
                          setSelectedLead(leads);
                          setEditActive(true);
                          setUpdateData({
                            name: leads.name || "",
                            email: leads.email || "",
                            phoneNumber: leads.phoneNumber || "",
                            status: leads.status || "New",
                            source: leads.source || "",
                            tags: leads.tags?.join(",") || "",
                            assigned: leads.assigned?._id || "",
                            notes: ""
                          });
                        }}
                      >
                        Edit
                      </button></td>
                      <td><button className='delete' onClick={() => handleDelete(leads._id)}>Delete</button></td>
                    </tr>
                  )))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      {editActive && (
        <div className="popUpProfile" onClick={() => {
          setEditActive(false);
          setUpdateData({
            name: "",
            email: "",
            phoneNumber: "",
            status: "New",
            source: "",
            tags: "",
            assigned: "",
            notes: ""
          });
        }}>
          <div className="popUpModal" onClick={(e) => e.stopPropagation()}>
            <div className="headerPopUp">
              <h2>{selectedLead ? "Update Lead..." : "Create New Lead..."}</h2>
              <p>{selectedLead ? "Make changes to your Leads here." : "Make your new Leads here."}</p>
              <button onClick={() => {
                setEditActive(false);
                setUpdateData({
                  name: "",
                  email: "",
                  phoneNumber: "",
                  status: "New",
                  source: "",
                  tags: "",
                  assigned: "",
                  notes: ""
                });
              }}>X</button>
            </div>
            <div className='popUpEditProfile'>
              <form onSubmit={selectedLead ? handleUpdate : handleCreateLead}>
                <div className="nameConatiner">
                  <div className="firstName">
                    <label>Name</label>
                    <input placeholder='Full Name' value={updateData?.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} />
                  </div>
                  <div className="firstName">
                    <label>Email</label>
                    <input placeholder='abc@gmail.com' value={updateData?.email} onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })} />
                  </div>
                </div>
                <div className="nameConatiner">
                  <div className="lastName">
                    <label>Phone Number</label>
                    <input placeholder='0000-1234-5678' value={updateData?.phoneNumber} onChange={(e) => setUpdateData({ ...updateData, phoneNumber: e.target.value })} />
                  </div>
                  <div className="lastName">
                    <label>Status</label>
                    <select value={updateData.status} onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                      <option value="Won">Won</option>
                    </select>
                  </div>
                </div>
                <div className="nameConatiner">
                  <div className="firstName">
                    <label>Source</label>
                    <input placeholder='Enter a Source' value={updateData?.source} onChange={(e) => setUpdateData({ ...updateData, source: e.target.value })} />
                  </div>
                  <div className="lastName">
                    <label>Tags</label>
                    <input placeholder='Enter a Tag1, Tag2' value={updateData?.tags} onChange={(e) => setUpdateData({ ...updateData, tags: e.target.value })} />
                  </div>
                </div>
                <div className="nameConatiner">
                  {role === "Super Admin" && (<div className="lastName">
                    <label>Assigned to</label>
                    <select
                      value={updateData.assigned}
                      onChange={(e) => {
                        const value = e.target.value.split("|");
                        setUpdateData({
                          ...updateData,
                          assigned: value[0],
                          assignedModel: value[1]
                        });
                      }}
                    >
                      <option value="">Select</option>
                      {supportAgentData.map(agent => (
                        <option key={agent._id} value={`${agent._id}|SubAdmin`}>
                          {agent.firstName} {agent?.lastName} (Sub Admin)
                        </option>
                      ))}
                      {agents.map(agent => (
                        <option key={agent._id} value={`${agent._id}|SupportAgent`}>
                          {agent.firstName} {agent?.lastName} (Support Agent)
                        </option>
                      ))}
                    </select>
                  </div>)}
                  {role === "Sub Admin" && (<div className="lastName">
                    <label>Assigned to</label>
                    <select
                      value={updateData.assigned}
                      onChange={(e) => {
                        const value = e.target.value.split("|");
                        setUpdateData({
                          ...updateData,
                          assigned: value[0],
                          assignedModel: value[1]
                        });
                      }}
                    >
                      <option value="">Select</option>
                      {agents.map(agent => (
                        <option key={agent._id} value={`${agent._id}|SupportAgent`}>
                          {agent.firstName} {agent?.lastName} (Support Agent)
                        </option>
                      ))}
                    </select>
                  </div>)}
                  <div className="firstName">
                    <label>Notes</label>
                    <textarea placeholder='Type Notes here' value={updateData?.notes} onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })} />
                  </div>
                </div>
                <div className="nameConatinerButton">
                  <button type='submit' className='editSubmit'>Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>)}
      {viewPage && (
        <div className="popUpProfile" onClick={() => setViewPage(false)}>
          <div className="popUpModal" onClick={(e) => e.stopPropagation()}>
            <div className="headerPopUp">
              <h2>Lead Details</h2>
              <p>your Leads here.</p>
              <button onClick={() => setViewPage(false)}>X</button>
            </div>
            <div className='popUpEditProfile viewPage'>
              <p>Name: {selectedLead?.name}</p>
              <p>Email: {selectedLead?.email}</p>
              <p>Phone Number: {selectedLead?.phoneNumber}</p>
              <p>Source: {selectedLead?.source}</p>
              <p>Tags: {selectedLead?.tags?.join(", ")}</p>
              <p>
                Notes: {selectedLead?.notes?.length > 0
                  ? selectedLead.notes[selectedLead.notes.length - 1].message
                  : "No notes"}
              </p>
              <p>Assigned To: {selectedLead?.assigned?.firstName || "Not assigned"}</p>
            </div>
          </div>
        </div>)}
      {viewTags && (
        <div className="popUpProfile viewTags" onClick={() => setViewTags(false)}>
          <div className="popUpModal" onClick={(e) => e.stopPropagation()}>
            <div className="headerPopUp">
              <h2>Add Tags</h2>
              <p>Add Your Tags here.</p>
              <button onClick={() => setViewTags(false)}>X</button>
            </div>
            <div className='popUpEditProfile viewTag'>
              <input type='text' placeholder='Add your Tags here' value={newTag} onChange={(e) => setNewTag(e.target.value)} />
            </div>
            <button className='tagBtn' onClick={addNote}>Add tag</button>
          </div>
        </div>
      )}
      {viewTagsEdit && (<div className="popUpProfile viewTags" onClick={() => setViewTagsEdit(false)}>
        <div className="popUpModal" onClick={(e) => e.stopPropagation()}>
          <div className="headerPopUp">
            <h2>Tags</h2>
            <p>Edit Or Delete Your Tags here.</p>
            <button onClick={() => setViewTagsEdit(false)}>X</button>
          </div>
          <div className='popUpEditProfile viewTag'>
            {selectedLead?.tags?.length > 0 ? selectedLead?.tags?.map((tag, index) => {
              const originalTag = data.find(l => l._id === selectedLead._id)?.tags[index];
              return (
                <div className='tagEditDeleteMain' key={index}>
                  <input value={tag} onChange={(e) => handleTagChange(index, e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") {e.preventDefault(); updateTag(originalTag, index);}}} />
                  <div className="buttonTags">
                    <button className='tagEdit' onClick={() => updateTag(originalTag, index)}><FaEdit /></button>
                    <button className='tagDelete' onClick={() => deleteTag(tag)}><MdDeleteForever /></button>
                  </div>
                </div>
              );
            }): (<p className='notags'>No Tags yet</p>)}
           
          </div>
        </div>
      </div>)}
    </>
  )
}

export default Lead;
