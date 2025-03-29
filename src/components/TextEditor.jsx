// TextEditor.js
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
//import io from 'socket.io-client';
import axios from 'axios';

//const socket = io('http://localhost:5000');

function TextEditor() {
  const { id } = useParams();
  const versionId = id
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Join the document room for realtime collaboration
    //socket.emit('joinDocument', versionId);

    // Fetch initial document content from the backend
    axios.get(`http://localhost:5000/api/documents/version/${versionId}`)
      .then(res => {
        console.log("---------------------->",res)
        if (res.data.success) {
          setContent(res.data.document.content);
        }
      })
      .catch(() => {
        // If the document is not found, start with an empty editor
        setContent('');
      });

    // Listen for realtime updates from other users
    // socket.on('textUpdate', ({ content: updatedContent }) => {
    //   setContent(updatedContent);
    // });

    // Cleanup on unmount
    return () => {
      //socket.off('textUpdate');
    };
  }, [versionId]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    // Broadcast changes to other clients in realtime
    //socket.emit('textUpdate', { versionId, content: newContent });
    setSaved(false);
  };

  const handleSave = () => {
    axios.post(`http://localhost:5000/document/${versionId}/save`, { content })
      .then(res => {
        if (res.data.success) {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      });
  };

  return (
    <div>
      <h2>Realtime Text Editor</h2>
      <textarea 
        value={content}
        onChange={handleChange}
        rows="20"
        cols="80"
      ></textarea>
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleSave}>Publish</button>
        {saved && <span style={{ marginLeft: '10px' }}>Saved!</span>}
      </div>
    </div>
  );
}

export default TextEditor;
