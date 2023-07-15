import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig.js';
import { collection, addDoc,doc,updateDoc } from "firebase/firestore";

const JoinRoom=({creator,gameRoomId,setPname})=>{
  const [roomId,setRoomId]=useState("");
  const handleChange=(e)=>{
    setRoomId(e.target.value);
  }
  const updateRoomField = async(documentId, field, value )=> {
          try {
            const roomRef = doc(db, "rooms", documentId);
        
            // Update the specific field with the provided value
            await updateDoc(roomRef, {
              [field]: value,
            });
            console.log("Room field updated successfully!");
          } catch (error) {
            console.log("Error updating room field:", error);
          }
        }
  return(
    <>
    <div className="joinRoomContainer">
    
      <div className="backBtn">
      <Link to="/">
        <i className="fa-solid fa-arrow-left" style={{color:" #ffffff"}}></i></Link>
      </div>
      
      <div className="roomTitle">
        <h1>Let's make you play.</h1>
        <p>Welcome to the Bingo game!</p>
      </div>
      <input id="pname" placeholder="Enter your name" className="pname" type="text" />
      <input onChange={(e)=>{
        handleChange(e);
      }} value={roomId} placeholder="Enter room id." className="pname" id="joinId" type="text" />
      
      <div onClick={()=>{
        if(creator){
          updateRoomField(roomId,"user1",1);
        }else{
          updateRoomField(roomId,"user2",1);
        }
        gameRoomId(roomId);
        setPname(document.getElementById('pname').value);
      }} className="startBtn"><Link style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",width:"100%"}}  to="/game"><p>Start</p></Link>
      </div>
    </div>
    </>
  );
}
export default JoinRoom;