import { BrowserRouter, Route, Routes } from "react-router-dom";

import CreateStream from "./pages/CreateStream";
import Dashboard from "./pages/Dashboard";
import EditStream from "./pages/EditStream";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-stream" element={<CreateStream />} />
        <Route path="/edit-stream/:id" element={<EditStream />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;