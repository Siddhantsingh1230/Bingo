import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig.js';
import { collection, addDoc,doc,updateDoc } from "firebase/firestore";

const CreateRoom = ({creator,setPname,gameRoomId}) => {
  const [roomId,setRoomId]=useState("Your room id.");
  
  const [text,setText]=useState("");
   //FireBase 
  const createNewRoom = async () => {
  try {
    const docRef = await addDoc(collection(db, "rooms"), {
      user1:'',
      user2:'',
      turn:null,
      win:'',
      start1:0,
      start2:0,
      activeNum:null,
    });
    setRoomId(docRef.id);
    gameRoomId(docRef.id);
    setText(docRef.id);
    document.getElementById('roomId').style.color="white";
  } catch (error) {
    setRoomId("Your room id.");
    document.getElementById('roomId').style.color="grey";
  }
};
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setRoomId(text);
    }, 400);
    document.getElementById('roomId').style.color="white";
    return () => clearTimeout(timeoutId);
  }, [roomId, text]);
  useEffect(() => {
    //For generating room id.
    createNewRoom();
    //For ClipBoard Copy 
    document.getElementById("clipboard").addEventListener("click", () => {
      let id = document.getElementById("roomId");
      
      if (id.innerText != "Your room id." && id.innerText != "") {
        navigator.clipboard
          .writeText(id.innerText)
          .then(() => {
            id.style.color="white";
            setRoomId("copied🔥");
          })
          .catch((error) => {
            alert("Failed to copy to clipboard.");
            console.error(error);
          });
       
      }
    });
    
  }, []);
  
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
    
  return (
    <>
      <div className="createRoomContainer">
      
        <div className="backBtn">
        <Link to="/">
          <i className="fa-solid fa-arrow-left" style={{color:" #ffffff"}}></i></Link>
        </div>
        
        <div className="roomTitle">
          <h1>Let's make you play.</h1>
          <p>Welcome to the Bingo game!</p>
        </div>
        <input placeholder="Enter your Name" id="pname" className="pname" type="text" />
        <div className="roomId">
          <span id="roomId">{roomId}</span>
          <i
            id="clipboard"
            className="clip fa-regular fa-clipboard"
            style={{color:" #d3d3d3"}}
          ></i>
        </div>

        <div onClick={()=>{
        if(creator){
          updateRoomField(roomId,"user1",1);
        }else{
          updateRoomField(roomId,"user2",1);
        }
        setPname(document.getElementById('pname').value);
        }} className="startBtn"><Link style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",width:"100%"}} to="/game"><p>Start</p></Link>
        </div>
      </div>
    </>
  );
};
export default CreateRoom;
