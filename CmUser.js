import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CmUser.css';
import {Link} from 'react-router-dom'
import TableModal from './TableModal';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
// import FacebookIcon from '@mui/icons-material/Facebook';
import CottageIcon from '@mui/icons-material/Cottage';
import Button from '@mui/material/Button';
import BalanceIcon from '@mui/icons-material/Balance';
import LogoutIcon from '@mui/icons-material/Logout';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpider } from '@fortawesome/free-solid-svg-icons';
import { faDailymotion } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import StarsIcon from '@mui/icons-material/Stars';
import InputAdornment from '@mui/material/InputAdornment';
import cdaclogo from '../../../src/images/cdac-logo-wide.png';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { faSpider } from '@fortawesome/free-solid-svg-icons';
import {
  faSquareFacebook,
  faInstagram,
  faYoutube,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";


// Add the icons to the library
library.add(faDailymotion);
// import { Link } from 'react-router-dom

function CmUser() {
  const [data, setData] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState('Session Records'); // New state for view mode
  const [_, setPostDetails] = useState(null); // New state for post details
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [numberInput, setNumberInput] = useState('');
  const [isSpecificDateEnabled,setIsSpecificDateEnabled]=useState(false)
  const [dateWiseData,setDateWiseData]=useState([])
  const [isSearching, setIsSearching] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [sessionData, setsessionData] = useState([]);
  const [postCount, setPostCount] = useState("")

  const arrayResult = keywordInput.split(',').map(word => word.trim());

  const handleInputChange = (event) => {
    const { value } = event.target;
    setIsSearching(value.length > 0);
  };


  const statusMap = {
    0: { text: 'Data Crawling.....', color: 'blue' },
    1: { text: 'Crawling Complete', color: 'green' },
    2: { text: 'Running Analysis.....', color: 'orange' },
    3: { text: 'Analysis Complete', color: 'purple' }
  };

  
  let interval = 0
  console.log(dateWiseData.length)
  const handleNumberInputChange = (e) => {
    const value = e.target.value;
    // Ensure the value is a non-negative integer
    if (value === '' || /^\d+$/.test(value)) {
      setNumberInput(value);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  console.log(isSpecificDateEnabled)
  useEffect(() => {
    fetchData(selectedPlatform);
    
    if(isSpecificDateEnabled===false){
       interval = setInterval(() => {
        fetchData(selectedPlatform);
      }, 60000);
    }
    
    return () => clearInterval(interval);
  }, [selectedPlatform]);

  const fetchData = async (platform) => {
    setIsSpecificDateEnabled(false)
    setDateWiseData([])
    try {
      let result;
      if (platform === 'All') {
        const [result1, result2, result3, result4,result5] = await Promise.all([
          axios.get('http://10.226.38.240:5000/api/fetch/twitter'),
          axios.get('http://10.226.38.240:5000/api/fetch/youtube'),
          axios.get('http://10.226.38.240:5000/api/fetch/instagram'),
          axios.get('http://10.226.38.240:5000/api/fetch/facebook'),
          axios.get('http://10.226.38.240:5000/api/fetch/dailymotion'),
          
        ]);
        result = { data: { results: [...result1.data.results, ...result2.data.results, ...result3.data.results, ...result4.data.results, ...result5.data.results] } };
      } else {
        result = await axios.get(`http://10.226.38.240:5000/api/fetch/${platform.toLowerCase()}`);
      }
      setData(result.data.results);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };


  const getSessionDetails = async (sessionID) => {
    setOpenModal(true)
    console.log('openmodal',openModal)
    try {
      const response = await axios.post('http://10.226.38.240:5000/getData', { sessionID });
      console.log('Response:', response.data);
      setsessionData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const SessionButton = ({ sessionID }) => (
    <Button onClick={() => getSessionDetails(sessionID)} variant="outlined" style={{ marginRight: '10px' }}>
      <VisibilityIcon style={{ marginRight: '5px', fontSize: '30px' }} />
    </Button>
  );
  const AnalytisButton = ({ id, platform, disabled }) => (
    <Button disabled={disabled} onClick={() => fetchSessionDetails(id, platform)} variant="outlined" style={{ marginRight: '10px', color: 'green'}}>
      <AnalyticsIcon style={{ marginRight: '5px', fontSize: '30px' }} />
    </Button>
  );


  const sidebarItemClick = (mode) => {
    console.log('mode', mode);
    if (mode === 'Crawled Data') {
      setSelectedPlatform('All'); // Set to 'All' to show data from all platforms
      setCurrentPage(1);
      setIsLoading(true);
      setViewMode(mode); // Set view mode to 'Crawled Data'
      fetchData();
      setPostDetails(null); // Reset post details if any
    } else if (mode === 'searchPost') {
      setSelectedPlatform(mode); // Set selected platform for 'Session Records'
      setCurrentPage(1);
      setIsLoading(true);
      setViewMode('searchPost');
      setPostDetails(null); // Reset post details if any
    } else if (mode === 'information') {
      setSelectedPlatform(mode); // Set selected platform for 'Session Records'
      setCurrentPage(1);
      setIsLoading(true);
      setViewMode('information');
      setPostDetails(null);
    } else {
      setSelectedPlatform(mode); // Set selected platform for 'Session Records'
      setCurrentPage(1);
      setIsLoading(true);
      setViewMode('Session Records');
      setPostDetails(null); // Reset post details if any
    }
  };
  

  const clearAllRecords = async () => {
    if (window.confirm('Are you sure you want to clear all records?')) {
      try {
        if (selectedPlatform === 'All') {
          await Promise.all([
            axios.post('http://10.226.38.240:5000/api/clear_all/twitter'),
            axios.post('http://10.226.38.240:5000/api/clear_all/youtube'),
            axios.post('http://10.226.38.240:5000/api/clear_all/instagram'),
            axios.post('http://10.226.38.240:5000/api/clear_all/facebook'),
            axios.post('http://10.226.38.240:5000/api/clear_all/dailymotion')
          ]);
        } else {
          await axios.post(`http://10.226.38.240:5000/api/clear_all/${selectedPlatform.toLowerCase()}`);
        }
        fetchData(selectedPlatform);
      } catch (error) {
        console.error('Error clearing all records:', error);
      }
    }
  };


  const deleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await axios.post('http://10.226.38.240:5000/api/delete', { document_id: id });
        if (response.data.status === 'success') {
          console.log(`Deleted record with ID ${id}`);
          fetchData(selectedPlatform); // Refresh data after successful deletion
        } else {
          console.error(`Failed to delete record with ID ${id}`);
        }
      } catch (error) {
        console.error(`Error deleting record with ID ${id}:`, error);
      }
    }
  };
  
  

  const filterDataByPlatform = (platform) => {
    if (platform === 'All') {
      return data;
    }
    return data.filter((item) => item.platform.toLowerCase() === platform.toLowerCase());
  };

  const filteredData = filterDataByPlatform(selectedPlatform);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsLoading(false);
      }, 400);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsLoading(false);
      }, 400);
    }
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
  };

  const handleKeywordInputChange = (e) => {
    setKeywordInput(e.target.value);
  };

  const handlePlatformChange = (e) => {
    setSelectedPlatforms(e.target.value);
  };

  const initiateTwitter = () => {
    alert('Twitter Scrapping Initiative')

    const payload = {
      keywords: arrayResult,
      postCount: postCount
    }
    axios.post(`http://10.226.39.64:5000/postInitiateTwitterScrap`, payload)
      .catch((error) => {
        alert(error)
      })
      setKeywordInput('')
  }
  const initiateYoutube = () => {
    alert('Youtube Scrapping Initiative')

    const payload = {
      keywords: arrayResult,
      postCount: postCount
    }
    axios.post(`http://10.226.42.136:5000/youtubeScrapper`, payload)
      .catch((error) => {
        alert(error)
      })
      setKeywordInput('')

  }

  const initiateFacebook = () => {
    alert('Facebook Scrapping Initiative')

    const payload = {
      keywords: arrayResult,
      postCount: postCount
    }
    axios.post(`http://10.226.36.226:5000/facebookScraper`, payload)
      .catch((error) => {
        alert(error)
      })
      setKeywordInput('')

  }

  const initiateDailymotion = () => {
    alert('Dailymotion Scrapping Initiative')
    const payload = {
      keywords: arrayResult,
      postCount: postCount
    }
    axios.post(`http://10.226.33.176:5000/dailyMotionScraper`, payload)
      .catch((error) => {
        alert(error)
      })
      setKeywordInput('')


  }

  const handleCrawlSubmit = async () => {
    console.log(arrayResult)
    console.log(selectedPlatforms)
    if (selectedPlatforms.includes("Twitter")) {
      initiateTwitter()
    }
    if (selectedPlatforms.includes("YouTube")) {
      initiateYoutube()
    }
    if (selectedPlatforms.includes("Facebook")) {
      initiateFacebook()
    }
    if (selectedPlatforms.includes("Dailymotion")) {
      initiateDailymotion()
    }

  };


  const handleDateWiseAPI = (time)=>{
     setIsSpecificDateEnabled(true)
     clearInterval(interval)
     const payload = {
        time:time
      }

    axios.post(`http://10.226.38.240:5000/api/dateWise`,payload)
    .then((res)=>{
      setDateWiseData(res.data)
    }).catch((error)=>{
      alert(error)
    })
  }
  const fetchSessionDetails = (id, platform) => {
   console.log(id,platform)
    const payload = {
      sessionID: String(id),
      platform: platform
    }

    axios.post('http://10.226.51.33:5000/classifier', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      console.log('Response:', response.data);
    })
    .catch((error) => {
      console.error('Error fetching post details:', error);
      alert(error);
    });
    

  };
  

  return (
    <div className="c-App">

      {/* nav bar */}

      <div className="c-navbar">
        <div className="c-navbar-item" id='text-align'>
          <BalanceIcon style={{ marginRight: '5px', fontSize: '30px' }} />
          <img src={cdaclogo} alt="CDAC Logo" style={{ marginLeft: '1px', height: '30px' }} />
        </div>
        <LogoutIcon className='c-logout-button' onClick={handleLogout} style={{ marginRight: '5px', fontSize: '30px' }} />
      </div>
      <div className="c-main">

      {/* side bar */}

        <div className="c-sidebar">
          
            <div className="c-sidebar-item" id='dashboard'>
              <Link to='/dashboard'>
              <CottageIcon style={{ marginRight: '5px', fontSize: '30px' }} />
              Dashboard
              </Link>
              
            </div>

          <div className={`c-sidebar-item ${dropdownOpen ? 'active' : ''}`} onClick={() => { setDropdownOpen(!dropdownOpen); sidebarItemClick('All'); }}>
          
      {/* Dashboard things */}
            

      {/* session records */}
      <FontAwesomeIcon icon={faDatabase} style={{ marginRight: '5px', fontSize: '25px' }} /> DataBase
            {dropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
          {dropdownOpen && (
            <div className="c-dropdown">
              <div className={`c-sidebar-item ${selectedPlatform === 'Twitter' ? 'active' : ''}`} onClick={() => sidebarItemClick('Twitter')}>
                {/* <XIcon style={{ marginRight: '5px', fontSize: '30px' }} />*/}
                <FontAwesomeIcon icon={faXTwitter} style={{ marginRight: '5px', fontSize: '25px' }} />Twitter 
              </div>
              <div className={`c-sidebar-item ${selectedPlatform === 'YouTube' ? 'active' : ''}`} onClick={() => sidebarItemClick('YouTube')}>
                {/* <YouTubeIcon style={{ marginRight: '5px', fontSize: '30px' }} /> */}
                <FontAwesomeIcon icon={faYoutube} style={{ marginRight: '5px', fontSize: '25px' }}/> YouTube
              </div>
              <div className={`c-sidebar-item ${selectedPlatform === 'Facebook' ? 'active' : ''}`} onClick={() => sidebarItemClick('Facebook')}>
                {/* <FacebookIcon style={{ marginRight: '5px', fontSize: '30px' }} /> */}
                <FontAwesomeIcon icon={faSquareFacebook} style={{ marginRight: '5px', fontSize: '25px' }} />Facebook
              </div>
              <div className={`c-sidebar-item ${selectedPlatform === 'Instagram' ? 'active' : ''}`} onClick={() => sidebarItemClick('Instagram')}>
                {/* <InstagramIcon style={{ marginRight: '5px', fontSize: '30px' }} /> */}
                <FontAwesomeIcon icon={faInstagram} style={{ marginRight: '5px', fontSize: '25px' }} />Instagram
              </div>
              <div className={`c-sidebar-item ${selectedPlatform === 'DailyMotion' ? 'active' : ''}`} onClick={() => sidebarItemClick('DailyMotion')}>
                <FontAwesomeIcon icon={faDailymotion} style={{ marginRight: '5px', fontSize: '25px' }} />
                Daily Motion
              </div>
            </div>
          )}
        
      {/* crawlled data */}

          <div className={`c-sidebar-item ${viewMode === 'Crawled Data' ? 'active' : ''}`} onClick={() => sidebarItemClick('Crawled Data')}>
            <FontAwesomeIcon icon={faSpider} style={{ marginRight: '5px', fontSize: '25px' }}/>Crawled Data
          </div>


          <div className={`c-sidebar-item ${viewMode === 'searchPost' ? 'active' : ''}`} onClick={() => sidebarItemClick('searchPost')}>
            <SearchIcon style={{marginRight:'5px', fontSize:'30px'}}/> Search Post
          </div>

          <div className={`c-sidebar-item ${viewMode === 'information' ? 'active' : ''}`} onClick={() => sidebarItemClick('information')}>
            <InfoIcon style={{marginRight:'5px', fontSize:'30px'}}/> Information
          </div>

        </div>

        {/* sidebar end */}


      
      {/* logo */}

        <div className="c-content">

          {viewMode === 'Session Records' && (
            <div style={{ textAlign: 'center' }}>
            <>
              <FontAwesomeIcon icon={faSpider} style={{ fontSize: '130px', marginBottom: '10px' }} className="shake"/>
              <br />
              <pre className='pt-sans-narrow-bold' style={{ marginTop: '2px' }}>Database Administrator</pre>
            </>
          </div>
          )}


     {/* session details */}

          {viewMode === 'Session Records' && (
            isLoading ? (
              <Box sx={{ width: '80%', margin: 'auto' }}>
                <table style={{ margin: 'auto', width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th><Skeleton /></th>
                      <th><Skeleton /></th>
                      <th><Skeleton /></th>
                      <th><Skeleton /></th>
                      <th><Skeleton /></th>
                      <th><Skeleton /></th>
                      <th><Skeleton /></th>
                      <th><Skeleton /></th>
                      <th><Skeleton /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(itemsPerPage)].map((_, index) => (
                      <tr key={index}>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            ) : (
              <table style={{ margin: 'auto', width: '80%', textAlign: 'center', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Document ID</th>
                    <th>Session ID</th>
                    <th>Date Created</th>
                    <th>Post Count</th>
                    <th>Unlawful Post</th>
                    <th>Keywords</th>
                    <th>Unlawful Keywords Count</th>
                    <th>Status</th>
                    <th>Platform</th>
                    {/* <th>Status Time</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td style={{ border: '1.5px solid black', padding: '8px' }}>{item._id}</td>
                      <td style={{ border: '1.5px solid black', padding: '8px' }}>{item.sessionId}</td>
                      <td style={{ border: '1.5px solid black', padding: '8px' }}>{item.dateCreated}</td>
                      <td style={{ border: '1.5px solid black', padding: '8px' }}>{item.postCount}</td>
                      <td style={{ border: '1.5px solid black', padding: '8px' }}>{item.unlawfulCount}</td>
                      <td style={{ border: '1.5px solid black', padding: '8px' }}>
                      {item.keywords && item.keywordCount && item.keywords.length > 0 && (
                        item.keywords.map((keyword) => (
                        item.keywordCount[keyword] != null && (
                        <div key={keyword}>
                          {keyword}: {item.keywordCount[keyword]}
                        </div>
                          )
                        ))
                      )}
                      </td>
                      <td style={{ border: '1.5px solid black', padding: '8px' }}>{item.unlawfulkeywordcount}</td>
                      {/* <td style={{ border: '1.5px solid black', padding: '8px' }}>{statusMap[item.status]}</td> */}
                      <td style={{ border: '1.5px solid black', padding: '8px', color: statusMap[item.status].color }}>
                        {statusMap[item.status].text}
                      </td>
                      <td style={{ border: '1.5px solid black', padding: '8px' }}>{item.platform}</td>
                      {/* <td style={{ border: '1.5px solid black', padding: '8px' }}>{item.update_time}</td> */}
                      <td style={{ border: '1.5px solid black', padding: '8px' }}>
                        <IconButton aria-label="delete" size="large">
                          <DeleteIcon onClick={() => deleteRecord(item._id)} />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

{/* search fields */}
          {viewMode === 'Crawled Data' && (
            <div className="c-search-panel">
              <h2>Search Panel</h2>
              <div className="c-search-form">
                <TextField
                  className="c-keyword-input"
                  label="Keyword"
                  value={keywordInput}
                  onChange={handleKeywordInputChange}
                  fullWidth
                  margin="normal"
                />
                <div className="c-platform-select-container">
                  <TextField
                    className="c-platform-select"
                    select
                    label="Platforms"
                    value={selectedPlatforms}
                    onChange={handlePlatformChange}
                    margin="normal"
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) => selected.join(', '),
                      style: { height:'100%' }, // Adjust the width here
                    }}
                  >
                    {['Twitter', 'YouTube', 'Facebook', 'Instagram'].map((platform) => (
                      <MenuItem key={platform} value={platform}>
                        {platform}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div>
                  <TextField
                  className='c-count'
                    type="text"
                    label="Enter a number"
                    value={numberInput}
                    onChange={handleNumberInputChange}
                  />
                </div>

                <Button className="c-submit-button" variant="contained" color="primary" onClick={handleCrawlSubmit} >
                  <SendIcon style={{ marginRight: '5px', fontSize: '30px' }} />
                </Button>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'2rem'}}> 
                <div className='dateWiseBtn' onClick={fetchData}>All</div>
                <div className='dateWiseBtn' onClick={()=> handleDateWiseAPI(0.5)}>Last 12 Hours</div>
                <div className='dateWiseBtn' onClick={()=> handleDateWiseAPI(1)}>Last 24 Hours</div>
                <div className='dateWiseBtn' onClick={()=> handleDateWiseAPI(7)}>Last 7 Days</div>
              </div>
            </div>
          )}
        <div style={{padding:'5px'}}>
        {openModal && (
                <TableModal
                  cardData={sessionData}
                  open={openModal}
                  handleClose={handleCloseModal}
                />
              )}
        </div>
        { dateWiseData.length>1 ? (
           <div className="c-crawled-data" >

              {openModal && (
                <TableModal
                  cardData={sessionData}
                  open={openModal}
                  handleClose={handleCloseModal}
                />
              )}
            
           {dateWiseData.map((session) => (
             <div className="c-card" key={session.id} style={{ position: 'relative', width: '250px', marginRight: '20px' }}>
               {/* Skeleton loading overlay */}
               {isLoading && (
                 <div className="c-card-skeleton" style={{ position: 'absolute', top: 0, left: 0, width: '250px', height: '300px', borderRadius: '8px', background: 'linear-gradient(135deg, #dde4f0, #f0f0f0)', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                   <Skeleton variant="rectangular" width={210} height={118} style={{ marginRight: '10px' }} />
                   <div>
                     <Skeleton width="60%" style={{ marginBottom: '8px' }} />
                     <Skeleton width="40%" style={{ marginBottom: '8px' }} />
                     <Skeleton width="80%" style={{ marginBottom: '8px' }} />
                     <Skeleton width="60%" />
                   </div>
                 </div>
               )}

               {/* Actual data content */}
               {!isLoading && (
                 <>
                   <h3>Session: {session.sessionId}</h3>
                   <p>Date Created: {session.dateCreated.$date}</p>
                   <p>Post Count: {session.postCount}</p>
                   <p>Keywords: {session.keywords.join(', ')}</p>
                   <span>
                        <span> Status: </span>
                        <span style={{ color: statusMap[session.status].color }}>
                          {statusMap[session.status].text}
                        </span>
                      </span>
                   <p>Platform: {session.platform}</p>
                   <SessionButton sessionID={session.sessionId} />
                   <AnalytisButton status={session.status} disabled={session.status !== 1}  id={session.sessionId} platform={session.platform} />
                 </>
               )}
             </div>
           ))}
         </div>
        ):(
         <>
         {viewMode === 'Crawled Data' && isSpecificDateEnabled===false && dateWiseData.length<1 &&(
            <div className="c-crawled-data" >

              {data.map((session) => (
                <div className="c-card" key={session.id} style={{ position: 'relative', width: '250px', marginRight: '20px' }}>
                  {/* Skeleton loading overlay */}
                  {isLoading && (
                    <div className="c-card-skeleton" style={{ position: 'absolute', top: 0, left: 0, width: '250px', height: '300px', borderRadius: '8px', background: 'linear-gradient(135deg, #dde4f0, #f0f0f0)', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                      <Skeleton variant="rectangular" width={210} height={118} style={{ marginRight: '10px' }} />
                      <div>
                        <Skeleton width="60%" style={{ marginBottom: '8px' }} />
                        <Skeleton width="40%" style={{ marginBottom: '8px' }} />
                        <Skeleton width="80%" style={{ marginBottom: '8px' }} />
                        <Skeleton width="60%" />
                      </div>
                    </div>
                  )}

                  {/* Actual data content */}
                  {!isLoading && (
                    <>
                      <h3>Session: {session.sessionId}</h3>
                      <p>Date Created: {session.dateCreated}</p>
                      <p>Post Count: {session.postCount}</p>
                      <p>Keywords: {session.keywords.join(', ')}</p>
                      <span>
                        <span> Status: </span>
                        <span style={{ color: statusMap[session.status].color }}>
                          {statusMap[session.status].text}
                        </span>
                      </span>
                      <p>Platform: {session.platform}</p>
                      <SessionButton sessionID={session.sessionId} />
                      <AnalytisButton id={session.sessionId} disabled={session.status !== 1} platform={session.platform} />

                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          </> )

          }

{/* Search Post */}
{viewMode === 'searchPost' && (
        <TextField
          className="c-post-link"
          placeholder="Search"
          variant="outlined"
          fullWidth
          style={{ width: '90%' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  {isSearching ? <SendIcon /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            ),
            classes: {
              root: 'c-post-link-root',
              focused: 'c-post-link-focused',
            },
          }}
          onChange={handleInputChange}
        />
      )}


{/* information details */}
{viewMode === 'information' && (
  <div className="info-sections" style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div className="c-card-info" style={{ flex: 1, marginRight: '20px', padding: '20px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', transition: '0.3s', borderRadius: '10px' }}>
      <h2>Step.1</h2>
      <br/>
      <h2>How to initiate Data Mining</h2>
      <br/>
      <h3>Starting the Scrappers</h3>
      <br/>
      <p>Follow these steps to start the Scraping process:</p>
      <br/>
      <ol>
        <li>Click on the <strong>"Crawled Data"</strong> on SideBar.</li>
        <li>Enter the keywords you want to search for in the <strong>keywords input field</strong>.</li>
        <li>Select the platform from which you want to crawl data (e.g., Twitter, YouTube).</li>
        <li>Click the <strong>"Send"</strong> button to begin the crawl.</li>
      </ol>
      <br/>
      <p><strong>***</strong> A session ID will be created for the crawl, and the crawling process will start.</p>
      <br/>
      <p style={{ display: 'flex', alignItems: 'center' }}>
        <StarsIcon style={{ marginRight: '8px' }}/> Note that you can only initiate one crawling session at a time.
      </p>
      <br/>
      <h3>Viewing Crawled Data</h3>
      <br/>
      <p>To view the data being crawled, follow these steps:</p>
      <br/>
      <ol>
        <li>Click on the <strong>"Eye"</strong> button.</li>
      </ol>
      <br/>
      <p>This will display the information related to the data being crawled.</p>
    </div>

    <div className="c-card-info" style={{ flex: 1, paddingLeft: '20px', padding: '20px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', transition: '0.3s', borderRadius: '10px' }}>
      <h2>Step.2</h2>
      <br/>
      <h2>Performing Analysis</h2>
      <br/>
      <p>Once the crawling process is complete, you can perform an analysis of the data. Follow these steps:</p>
      <br/>
      <ol>
        <li>Click on the <strong>"Analysis"</strong> button.</li>
      </ol>
      <br/>
      <p style={{ display: 'flex', alignItems: 'center' }}>
        <StarsIcon style={{ marginRight: '8px' }} /> The analysis will start, and you can only perform one analysis at a time.
      </p>
      <br/>
      <h3>Status Updates</h3>
      <br/>
      <p>There are four status stages during the crawling and analysis process:</p>
      <br/>
      <ul>
        <li><strong>Crawling Data:</strong> When you initiate crawling, the status is set to "Crawling Data".</li>
        <li><strong>Crawling Complete:</strong> Once crawling is complete, the status changes to "Crawling Complete".</li>
        <li><strong>Processing Started:</strong> When you click the "Analysis" button, the status changes to "Processing Started".</li>
        <li><strong>Analysis Complete:</strong> After the analysis is complete, the status updates to "Analysis Complete". You can then view the results on the main dashboard, which includes charts and other information.</li>
      </ul>
    </div>
  </div>
)}


          {viewMode === 'Session Records' && (
            <div className="c-pagination-controls">
            <UndoIcon style={{ marginRight: '5px', fontSize: '30px' }} onClick={handlePreviousPage} disabled={currentPage === 1} />
            <span>{currentPage} / {totalPages}</span>
            <RedoIcon style={{ marginRight: '5px', fontSize: '30px' }} onClick={handleNextPage} disabled={currentPage === totalPages} />
          </div>
          )}
          
          {viewMode === 'Session Records' && (
            
            <div className='c-clear-button'>
            <Button onClick={clearAllRecords} variant="outlined" color='error'>
              Clear
            </Button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CmUser;