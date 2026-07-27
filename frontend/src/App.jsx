import './App.css';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateStream from './pages/CreateStream';
import Streams from './pages/Streams';
import Profile from './pages/Profile';

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/streams" element={<Streams />} />

        <Route path="/create" element={<CreateStream />} />

        <Route path="/profile" element={<Profile />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;