import { useEffect } from "react";
import { Link } from 'react-router-dom';

const Room = ({setCreator}) => {
  useEffect(() => {
    document.querySelector(".createRoom").addEventListener("mouseover", (e) => {
      const active = document.getElementById("active");
      active.style.left = "0";
      document.querySelector("#joinText").style.color = "white";
      document.getElementById("createText").style.color = "black";
    });
    document.querySelector(".joinRoom").addEventListener("mouseover", (e) => {
      const active = document.getElementById("active");
      active.style.left = "50%";
      document.querySelector("#joinText").style.color = "black";
      document.getElementById("createText").style.color = "white";
    });
  }, []);

  return (
    <div className="roomContainer">
      <div className="imageContainer"></div>
      <div className="title">
        <h1>Bingo</h1>
        <p>
          Feel the thrill, embrace the fun! Bingo - where luck and excitement
          become one.Created with ❤️ Siddhant{" "}
        </p>
      </div>
      <div className="socialIcons">
        <a href="https://www.instagram.com/siddhantsingh1230/">
          <i className="fa-brands fa-instagram" style={{color: "#ffffff"}}></i>
        </a>
        <a href="https://www.linkedin.com/in/siddhantsingh1230">
          <i className="fa-brands fa-linkedin" style={{color: "#ffffff"}}></i>
        </a>
        <a href="https://github.com/Siddhantsingh1230">
          <i className="fa-brands fa-github" style={{color: "#ffffff"}}></i>
        </a>
      </div>
      <div className="actions">
       <div onClick={
         ()=>{
           setCreator(true);
         }
       } id="createRoom" className="createRoom ">
          <Link to="/createRoom"><p id="createText">CREATE</p></Link>
        </div>
        
        
        <div onClick={()=>{
          setCreator(false);
        }} id="joinRoom" className="joinRoom">
          <Link to="/joinRoom"><p id="joinText">JOIN</p></Link>
        </div>
        
        <div id="active"></div>
      </div>
    </div>
  );
};
export default Room;
