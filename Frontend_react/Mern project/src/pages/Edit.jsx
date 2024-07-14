import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../authContext';
import Navbar from '../components/Navbar';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/create.css';

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState({});
    const [existingData, setExistingData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/entries/${id}`);
                setExistingData(res.data);
                setInfo({
                    title: res.data.title,
                    location: res.data.location,
                    date: res.data.date,
                    text: res.data.text,
                });
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleFileChange = (e) => {
        setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    };

    const handleClick = async (e) => {
        e.preventDefault();

        let updatedEntry;

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

            updatedEntry = {
                ...info,
                author: user._id,
                photos: [...existingData.photos, ...list],
            };
        } else {
            updatedEntry = {
                ...info,
                author: user._id,
                photos: existingData.photos,
            };
        }

        try {
            await axios.put(`/api/entries/${id}`, updatedEntry, {
                withCredentials: false,
            });

            navigate(`/view/${id}`);
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
                        <h2>Upload Images (Max 3)</h2>
                        <label htmlFor="file">
                            <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                        </label>
                        <input
                            type="file"
                            id="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className="uploadedPictures">
                        {existingData.photos && existingData.photos.map((photo, index) => (
                            <div className="upload_pic" key={index}>
                                <img src={photo} alt="" height="80px" />
                            </div>
                        ))}
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
                        value={info.title || ''}
                        placeholder="Enter Title"
                    />
                </div>
                <div className="input">
                    <label htmlFor="location">Location</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="location"
                        value={info.location || ''}
                        placeholder="Enter Location"
                    />
                </div>

                <div className="input">
                    <label htmlFor="date">What is the Date</label>
                    <input
                        onChange={handleChange}
                        type="date"
                        id="date"
                        value={info.date || ''}
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
                        value={info.text || ''}
                        autoFocus
                    ></textarea>
                </div>

                <button className="createBtn" onClick={handleClick}>
                    Update Entry
                </button>
            </div>
        </div>
    );
};

export default Edit;
