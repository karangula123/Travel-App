// client/src/pages/View.jsx 

import React, { 
	useContext, 
	useState 
} from 'react'
import Navbar from '../components/Navbar'
import useFetch from '../useFetch'
import { 
	faCalendar, 
	faMapLocationDot, 
	faCircleArrowLeft, 
	faCircleArrowRight 
} from "@fortawesome/free-solid-svg-icons"; 
import { 
	useLocation, 
	useNavigate 
} from "react-router-dom"; 
import { 
	FontAwesomeIcon 
} from "@fortawesome/react-fontawesome"; 
import "../styles/view.css"
import axios from "axios"; 
import { AuthContext } from "../authContext"; 

const View = () => { 
	const location = useLocation(); 
	const id = location.pathname.split("/")[2]; 
	const { user } = useContext(AuthContext); 
	const { data } = useFetch(`/api/entries/${id}`) 
	const [slideNumber, setSlideNumber] = useState(0); 

	const navigate = useNavigate(); 

	const handleDelete = async (id) => { 
		try { 

			await axios.delete(`/api/entries/${data._id}`) 

			navigate('/') 
		} catch (err) { 
			console.log(err) 
		} 
	}; 

	const handleMove = (direction) => { 
		let newSlideNumber; 
		let size = data.photos.length 
		if (direction === "l") { 
			newSlideNumber = slideNumber === 0 ? size - 1 : slideNumber - 1; 
		} else { 
			newSlideNumber = slideNumber === size - 1 ? 0 : slideNumber + 1; 
		} 
		setSlideNumber(newSlideNumber) 
	} 
	const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

	return ( 
		<div className='view'> 
			<Navbar /> 
			<div className="postPageBG"> 
				<div className="upperContent"> 
					<h1>{data.title}</h1> 
					<p><FontAwesomeIcon className="icon"
						icon={faCalendar} /> 
						{data.date} 
					</p> 
					<p><FontAwesomeIcon className="icon"
						icon={faMapLocationDot} /> 
						<span>{data.location} </span>
					</p> 
				</div> 
			</div> 

			<div className="postContainer"> 

				<div className="leftContainer"> 


					{data.photos ? (<div className="images"> 


						<img src={data.photos[slideNumber]} 
							height="300px" alt="" /> 

						{data.photos.length > 1 ? <div className="arrows"> 
							<FontAwesomeIcon 
								icon={faCircleArrowLeft} 
								className="arrow"
								onClick={() => handleMove("l")} 
							/> 
							<FontAwesomeIcon 
								icon={faCircleArrowRight} 
								className="arrow"
								onClick={() => handleMove("r")} 
							/> 
						</div> : ""} 
					</div>) : ("no Images")} 

				</div> 

				<div className="rightContainer"> 

					<p> 
						" {data.text} "
					</p> 
					<div className='edit_div'>
					<button className="del_button"
						style={{ "marginRight": "5px" }} 
						onClick={handleDelete}> 
						Delete 
					</button> 
					<button
                        className="del_button"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
					</div>
					

				</div> 

			</div> 
		</div> 
	) 
} 

export default View
