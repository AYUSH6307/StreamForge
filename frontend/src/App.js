import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateStream from "./pages/CreateStream";
import EditStream from "./pages/EditStream";
import Topology from "./pages/Topology";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";


import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/create-stream"
                        element={<CreateStream />}
                    />

                    <Route
                        path="/edit-stream/:id"
                        element={<EditStream />}
                    />

                    <Route
                        path="/topology"
                        element={<Topology />}
                    />

                </Route>

                {/* 404 */}
                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;