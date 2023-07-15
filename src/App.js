import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Room from './components/Room.js';
import CreateRoom from './components/CreateRoom.js';
import JoinRoom from './components/JoinRoom.js';
import Game from './components/Game.js';
import {useState} from "react";
function App() {
  const [gameRoomId,setGameRoomId]=useState("");
  const [pname,setPname]=useState("");
  const [creator,setCreator]=useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Room setCreator={setCreator}/>} />
        <Route path="/createRoom"  element={<CreateRoom creator={creator} setPname={setPname} gameRoomId={setGameRoomId} />} />
        <Route path="/joinRoom" element={<JoinRoom creator={creator}  setPname={setPname} gameRoomId={setGameRoomId}/>} />
        <Route path="/game" element={<Game roomId={gameRoomId} creator={creator} pname={pname}/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
