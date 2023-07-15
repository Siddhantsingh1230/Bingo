import Spinner from "./Spinner.js";
import Bingo from "./Bingo.js";
import { Link } from "react-router-dom";
import {useEffect,useState} from "react";
import { updateDoc, doc, getDoc ,setDoc ,onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig.js';

const Game=({roomId,pname,creator})=>{
  const [playersOnline,setPlayersOnline]=useState(false);
  const listenToDataChanges = ( documentId) => {
      try{
        const docRef = doc(db,"rooms", documentId);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            // Do something with the listenToDataChanges
            if(data.user1==1 && data.user2==1)
            {
              setPlayersOnline(true);
            }else{
              setPlayersOnline(false);
            }
            return data;
          } else {
            // Document doesn't exist
            console.log('Document does not exist');
          }
        });
      
        // Return the unsubscribe function
        return unsubscribe;
      }
        catch(e){
        window.location.href = "/";
      }
      };
  useEffect(()=>{
    listenToDataChanges(roomId);
  },[]);
  return(
    <>
    {
     !roomId ? <div style={{background:"black",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"1rem",height:"100%",width:"100%",textAlign:"center"}}><Link to="/" ><p style={{
       padding:"1rem",borderRadius:"0.8rem",color:"black",background:"white",fontWeight:"500"
     }}>Go Back!</p></Link></div>:
     (playersOnline)?<Bingo roomId={roomId} creator={creator} pname={pname}/>:<Spinner/>
    }
    </>
    );
}
export default Game;