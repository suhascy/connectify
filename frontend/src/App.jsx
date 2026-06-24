import "./App.css";

import Homepage from "./pages/Homepage";
import Chats from "./pages/Chats";

import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;