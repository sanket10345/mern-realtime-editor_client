// TextEditor.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentNameFromInput, setDocumentNameFromInput] = useState("")
  const [allFiles,setAllFiles] = useState([])
  const [selectedFileDocuments,setSelectedFileDocuments] = useState([])
  // Dummy data for files and versions
  const files = ['Document1', 'Report2024', 'Notes'];
  const versions = {
    Document1: ['Document1_20240325', 'Document1_20240324'],
    Report2024: ['Report2024_20240325', 'Report2024_20240320'],
    Notes: ['Notes_20240322', 'Notes_20240318']
  };

  const handleSelectFileClick = async (fileId) => {
    console.log("Fetching versions for file ID:", fileId);
    setSelectedFile(fileId);
    try {
      const res = await axios.get(`http://localhost:5000/api/documents/${fileId}`);
      console.log("API Response:", res.data); // Debugging
  
      if (res.data && res.data.success) {
        setSelectedFileDocuments(res.data.document || []); // Ensure it’s an array
      } else {
        setSelectedFileDocuments([]); // Clear previous data if API fails
      }
    } catch (error) {
      console.log("Error fetching versions:", error);
      setSelectedFileDocuments([]); // Handle API error gracefully
    }
  };

  const handleSelectVersionClick = async(versionId) =>{
    //history.push(`/docs/versionId`);
    navigate(`/docs/${versionId}`);
  }
  const handleCreateNewDocument = async ()=>{
    try {
      let userId = localStorage.getItem('userId')
      const res = await axios.post('http://localhost:5000/api/documents', { userId: parseInt(userId), title: documentNameFromInput });
      if (res.data) {
      console.log("----------------->",res.data)
      }
    } catch (error) {
      console.log(error,"<--------")
      alert('Login failed. Please check your credentials.');
    }
  }
  const fetchUserDocuments = async ()=>{
    try {
      let userId = localStorage.getItem('userId')
      const res = await axios.get(`http://localhost:5000/api/documents/user/${userId}`);
      if (res.data && res.data.success) {
console.log("-------------------------->",res.data.document)
      setAllFiles([...res.data.document])
      }
    } catch (error) {
      console.log(error.message,"<--------")
      alert('Login failed. Please check your credentials.');
    }
  }
  useEffect(() => {
    fetchUserDocuments()
  },[]);
  const getFileNameById = (fileId)=>{
    console.log("fileId------------->",fileId)
    console.log(allFiles)
    return allFiles.find((el) => el.id === fileId)?.title
  }
  return (
    <div>
      <h2>Edit Letter | Synchronize</h2>
      <div>
        <input type="text" name="document_name" onChange={(e)=>setDocumentNameFromInput(e.target.value)} value={documentNameFromInput}></input>
        <button onClick={handleCreateNewDocument}>Create</button>
        <h3>Files</h3>
        <ul>
          {allFiles && allFiles.length && (
          allFiles.map((file) => (
            <li key={file.id}
            onClick={() => handleSelectFileClick(file.id)}
            style={{ cursor: 'pointer', color: 'blue' }}>
              {file.title}
            </li>
          ))           
          )}
        </ul>
      </div>
      {selectedFile && selectedFileDocuments && selectedFileDocuments.length && (
        <div>
          <h3>Versions of {getFileNameById(selectedFile)}</h3>
          <ul>
            {selectedFileDocuments.map((version) => (
              <li key={version.id} onClick={() => handleSelectVersionClick(version.document_id)}>{JSON.stringify(version,null,2)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HomePage;