import { useState, useEffect ,useRef } from "react";
import { Link } from "react-router-dom";
import { updateDoc, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import Confetti from './Confetti.js';

const ObstructLayer=()=>{
  return(
    <>
      <div className="obstruct"></div>
    </>
    );
}
const Bingo = ({ roomId, creator, pname }) => {
  const pWin = useRef(null);
  const restartBtnRef=useRef(null);
  const [num, setNum] = useState(1);
  const [winFlag,setWinFlag] = useState(false);
  const [notifyStyle, setNotifyStyle] = useState({
    position: "absolute",
    bottom: "2rem",
    background: "#744fc6",
    height: "3rem",
    width: "3rem",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    opacity: "1",
    borderRadius: "50%",
    transition: "all ease 0.3s",
  });
  let notified = false;
  let [start, setStart] = useState(false);
  let notice = false;
  let [gameArray, setGameArray] = useState([]);
  // Add element in gameArray
  const addElement = (element) => {
    if (!gameArray.includes(element)) {
      setGameArray((prevArray) => [...prevArray, element]);
    }
  };
  //obstruct layer state variable
  const [showObstruct,setShowObstruct]=useState(false);
  //on component render
  useEffect(() => {
    listenToDataChanges(roomId);
  }, []);
  //for win check
  useEffect(() => {
      checkWin(gameArray);
  }, [gameArray]);
  //for FullScreen
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  //firebase
  const updateRoomField = async (documentId, field, value) => {
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
  };
  // Game Logic
  const handleClick = (e) => {
    if (num > 25 && start) {
      if(pname!=""){
        updateRoomField(roomId,'turn',pname);
      }else{
        if (creator) {
          updateRoomField(roomId,'turn',"a");
        }else{
          updateRoomField(roomId,'turn',"b");
        }
      }
      addElement(e.target.id);
      e.target.style.backgroundColor = "grey";
      const innerText = e.target.querySelector("p").innerText;
      updateRoomField(roomId, "activeNum", innerText);
    }
    if (e.target.innerHTML == "") {
      e.target.style.background = "white";
      let pTag = document.createElement("p");
      pTag.textContent = num;
      e.target.append(pTag);
      setNum((prevnum) => prevnum + 1);
      if (num == 25) {
        setNotifyStyle({
          position: "absolute",
          bottom: "2rem",
          background: "#744fc6",
          height: "3rem",
          opacity: "1",
          width: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          borderRadius: "50%",
          transition: "all ease 0.3s",
        });

        setNum((prevnum) => prevnum + 1);
      }
    }
  };
  const win = [
    ["00", "01", "02", "03", "04"],
    ["10", "11", "12", "13", "14"],
    ["20", "21", "22", "23", "24"],
    ["30", "31", "32", "33", "34"],
    ["40", "41", "42", "43", "44"],
    ["00", "10", "20", "30", "40"],
    ["01", "11", "21", "31", "41"],
    ["02", "12", "22", "32", "42"],
    ["03", "13", "23", "33", "43"],
    ["04", "14", "24", "34", "44"],
    ["00", "11", "22", "33", "44"],
    ["04", "13", "22", "31", "40"],
  ];
  function checkWin(board) {
    if (winFlag != true) {
      let distinctPatternCount = 0;
      // Check each winning pattern
      for (let pattern of win) {
        if (pattern.every((pos) => board.includes(pos))) {
          distinctPatternCount++;
          if (distinctPatternCount === 5) {
            setWinFlag(true);
            updateRoomField(roomId,'won',true);
            if (pname) {
                updateRoomField(roomId, "win", pname);
            } else {
                updateRoomField(roomId, "win", "अज्ञात");
             }
            
            //confetti();
            //confetti();
            document.getElementById('confetti').click();
            document.getElementById('confetti').click();
            
          }
        }
      }
    }
  }
  //listening to data changes in firestore
  const listenToDataChanges = (documentId) => {
    const docRef = doc(db, "rooms", documentId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Do something with the listenToDataChanges
        
        if (data.start1 == 1 && data.start2 == 1) {
          setStart(true);
        } else {
          setStart(false);
        }
        //Notification
        if (creator) {
          if (data.start2 == 1) {
            simpleToast();
          }
        } else {
          if (data.start1 == 1) {
            simpleToast();
          }
        }
        //winning 
        if (data.win != "" ) {
          setWinFlag(true);
          updateRoomField(roomId,'start1',0);
          updateRoomField(roomId,'start2',0);
          setStart(false);
          if(pWin){
            let crownHtml='<i className="fa-solid fa-crown fa-flip" style={{color: "#ffffff"}}></i>';
            pWin.current.innerHTML=(data.win).toUpperCase()+" WON "+crownHtml;
            setTimeout(()=>{
            restartBtnRef.current.style.display="inline-flex";
            setTimeout(()=>{
            restartBtnRef.current.style.display="none";
            
            pWin.current.innerHTML=pname.toUpperCase();
          reset();
          },2000);
          },2500);
          }
          
          
        }
        //click after board is populated with numbers
        if (data.activeNum) {
          clicker(data.activeNum);
        }
        //blocking interaction when its not your turn
        if(pname!=""){
          if(data.turn==pname){
            setShowObstruct(true);
          }else{
            setShowObstruct(false);
          }
        }else{
          if(creator){
            if(data.turn=="a"){
              setShowObstruct(true);
            }else{
              setShowObstruct(false);
            }
          }else{
            if(data.turn=="b"){
              setShowObstruct(true);
            }else{
              setShowObstruct(false);
            }
          }
        }
        
        return data;
      } else {
        // Document doesn't exist
        console.log("Document does not exist");
      }
    });

    // Return the unsubscribe function
    return unsubscribe;
  };
  // Clicker Method
  const clicker = (num) => {
    
    if(winFlag!=true){
      
    const spans = document.getElementsByClassName("box");
    for (let i = 0; i < spans.length; i++) {
      const pTag = spans[i].querySelector("p");

      if (pTag && pTag.innerText == num) {
        //earlier used
        //spans[i].click();
        //spans[i].onclick=null;
      spans[i].style.backgroundColor = "grey";
      addElement(spans[i].id);
        break; // Exit the loop after the first match is found
      }
    }}
  };
  //Notification Toast
  function simpleToast() {
    if (notified != true) {
      var x = document.getElementById("simpleToast");

      if (x) {
        x.className = "show";
        setTimeout(function () {
          x.className = x.className.replace("show", "");
        }, 3000);
      }
      notified = true;
    }
  }
  // for resetting Game
  const reset=()=>{
    notified = false;
    setGameArray([]);
    updateRoomField(roomId,'won',false);
    setShowObstruct(false);
    updateRoomField(roomId,'turn',null);
    notice=false;
    setStart(false);
    setWinFlag(false);
    setNum(1);
    setNotifyStyle({
    position: "absolute",
    bottom: "2rem",
    background: "#744fc6",
    height: "3rem",
    width: "3rem",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    opacity: "1",
    borderRadius: "50%",
    transition: "all ease 0.3s",
  });
    updateRoomField(roomId,'win','');
    updateRoomField(roomId,'activeNum',null);
   
    document.querySelectorAll(".box").forEach((item) => {
              item.innerHTML = "";
              item.style.backgroundColor = "black";
            });
  }
 
  
  return (
    <>
    {
      showObstruct && (<ObstructLayer/>)
    }
      <div className="bingoContainer">
        <div
          onClick={() => {
            if (creator) {
              updateRoomField(roomId, "user1", false);
            } else {
              updateRoomField(roomId, "user2", false);
            }
          }}
          className="back"
        >
          <Link to="/">
            <i className="fa-brands fa-uikit" style={{ color: "#ffffff" }}></i>
          </Link>
        </div>
        <div
          onClick={() => {
            toggleFullScreen();
          }}
          className="fullScr"
        >
          <i className="fa-solid fa-expand" style={{ color: "#ffffff" }}></i>
        </div >
        <div  className="playerName">
          <p ref={pWin}>{pname ? pname.toUpperCase() : "अज्ञात"}</p>
        </div>
        <div className="main">
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="00"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="01"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="02"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="03"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="04"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="10"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="11"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="12"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="13"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="14"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="20"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="21"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="22"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="23"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="24"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="30"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="31"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="32"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="33"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="34"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="40"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="41"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="42"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="43"
          ></span>
          <span
            onClick={(e) => {
              handleClick(e);
            }}
            className="box"
            id="44"
          ></span>
        </div>
        <div
          onClick={() => {
            setTimeout(function () {
              setNotifyStyle({
                position: "absolute",
                bottom: "2rem",
                background: "#744fc6",
                height: "3rem",
                width: "3rem",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                borderRadius: "50%",
                transition: "all ease 0.3s",
                opacity: "0",
              });
            }, 300);
            if (creator) {
              updateRoomField(roomId, "start1", 1);
            } else {
              updateRoomField(roomId, "start2", 1);
            }
          }}
          className="notify"
          style={notifyStyle}
        >
          <i className="fa-solid fa-bell" style={{ color: "#ffffff" }}></i>
        </div>
        <div id="simpleToast">
          <i
            className="fa-solid fa-flag-checkered"
            style={{ color: "#000000" }}
          ></i>
          <span>Opponent is Ready</span>
        </div>
        <button ref={restartBtnRef} className="button" type="button">
          <svg viewBox="0 0 16 16" className="bi bi-arrow-repeat" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
          <path d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" fill-rule="evenodd"></path>
        </svg>
            Restarting
        </button>
        <Confetti/>

      </div>
    </>
  );
};

export default Bingo;
