import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from "../Navbar/UserNavbar";
import './CSS/user.css';
import UserCard from './Components/UserCard/userCard';
import UpcomingElections from './Components/UpcomingElections';
import ScrollReveal from "scrollreveal";
import { BASE_URL } from '../../helper';

const User = () => {
  //const location = useLocation();
  const token = localStorage.getItem('authToken');
  const  voterst = {voterid:localStorage.getItem("voterid"),token:token};

  //Store JWT Token in localStorage
  useEffect(() => {
    if (voterst.token) {
      //alert(voterst.token);
      console.log(voterst)
      localStorage.setItem('authToken', voterst.token);
    }
  }, [voterst]);

  //Get JWT Token
 

  const revealRefBottom = useRef(null);
  const revealRefLeft = useRef(null);
  const revealRefTop = useRef(null);
  const revealRefRight = useRef(null);

  useEffect(() => {
    ScrollReveal().reveal(revealRefBottom.current, {
      duration: 1000, delay: 200, distance: '50px', origin: 'bottom', easing: 'ease', reset: true,
    });
  }, []);

  useEffect(() => {
    ScrollReveal().reveal(revealRefRight.current, {
      duration: 1000, delay: 200, distance: '50px', origin: 'right', easing: 'ease', reset: true,
    });
  }, []);

  useEffect(() => {
    ScrollReveal().reveal(revealRefLeft.current, {
      duration: 1000, delay: 200, distance: '50px', origin: 'left', easing: 'ease', reset: true,
    });
  }, []);

  useEffect(() => {
    ScrollReveal().reveal(revealRefTop.current, {
      duration: 1000, delay: 200, distance: '50px', origin: 'top', easing: 'ease', reset: true,
    });
  }, []);

  const [singleVoter, setVoter] = useState([]);

  useEffect(() => {
    //alert("shg"+token)
    if (token) {
     // alert(voterst.voterid);
      console.log(voterst)
      axios.get(`${BASE_URL}/voter/getVoter/${voterst.voterid}`, {
        headers: { Authorization: `Bearer ${token}` }, 
        // Send JWT Token in Header
      })
      .then((response) => { 
        console.log(response.data)
        
        setVoter(response.data.voter);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        // Handle expired/invalid token
        //localStorage.removeItem('authToken');
      });
    }
  }, [token]);

  return (
    <div className="User">
      <UserNavbar />
      <div className="Heading2" ref={revealRefTop}>
        <h3>Welcome <span>{singleVoter.firstName}</span></h3>
      </div>
      <div className="userPage">
        <div className="userDetails" ref={revealRefLeft}>
          <UserCard voter={singleVoter} />
        </div>
        <div className='details' ref={revealRefRight}>
          <h2>Welcome to <span>Online Voting Platform</span></h2>
          <h6>Exercise Your Right to Vote Anytime, Anywhere</h6>
          <p>Welcome to our online voting platform, where your voice matters...</p>
        </div>
      </div>
      <UpcomingElections voteStatus={singleVoter.voteStatus} />
    </div>
  );
};

export default User;
