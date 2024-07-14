import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/create.css';

const Create = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [files, setFiles] = useState([]); // Initialize as an array
    const [info, setInfo] = useState({});

    // Update state with user input
    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    // Handle file selection and update state
    const handleFileChange = (e) => {
        setFiles((prevFiles) => [
            ...prevFiles,
            ...Array.from(e.target.files),
        ]);
    };

    // Post data to the database
    const handleClick = async (e) => {
        e.preventDefault();

        let newEntry;

        if (files.length > 0) {
            const list = await Promise.all(
                files.map(async (file) => {
                    const data = new FormData();
                    data.append('file', file);
                    data.append('upload_preset', 'dpt8vmft');
                    const uploadRes = await axios.post(
                        'https://api.cloudinary.com/v1_1/dshrtyq0z/image/upload',
                        data,
                        { withCredentials: false }
                    );
                    const { url } = uploadRes.data;
                    return url;
                })
            );

            newEntry = {
                ...info,
                author: user._id,
                photos: list,
            };
        } else {
            newEntry = {
                ...info,
                author: user._id,
            };
        }

        try {
            const response = await axios.post('/api/entries/', newEntry, {
                withCredentials: false,
            });

            navigate(`/view/${response?.data?._id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="create">
            <Navbar />
            <div className="createContainer">
                <div className="picsContainer">
                    <div className="formInput">
                        <h2>Upload Images</h2>
                        <label htmlFor="file">
                            <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                        </label>
                        <input
                            type="file"
                            id="file"
                            multiple
                            onChange={handleFileChange} // Use the new handleFileChange function
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className="uploadedPictures">
                        {files.map((file, index) => (
                            <div className="upload_pic" key={index}>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt=""
                                    height="80px"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="input">
                    <label htmlFor="title">Title</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="title"
                        placeholder="Enter Title"
                    />
                </div>
                <div className="input">
                    <label htmlFor="location">Location</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="location"
                        placeholder="Enter Location"
                    />
                </div>

                <div className="input">
                    <label htmlFor="date">What is the Date</label>
                    <input
                        onChange={handleChange}
                        type="date"
                        id="date"
                        placeholder="Choose Date"
                    />
                </div>

                <div className="input">
                    <label htmlFor="entry">Write your thoughts..</label>
                    <textarea
                        name="entry"
                        id="text"
                        cols="50"
                        rows="10"
                        onChange={handleChange}
                        autoFocus
                    ></textarea>
                </div>

                <button className="createBtn" onClick={handleClick}>
                    Create Entry
                </button>
            </div>
        </div>
    );
};

export default Create;
