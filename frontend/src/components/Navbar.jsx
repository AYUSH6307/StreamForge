import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

function Navbar() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const response = await getCurrentUser();

                setUser(response.data);

            } catch (error) {

                console.log(error);

            }

        };

        fetchUser();

    }, []);

    const handleLogout = () => {

        localStorage.removeItem("token");

        alert("Logged out successfully!");

        navigate("/login");

    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">

            <div className="container-fluid">

                <h3 className="navbar-brand">
                    StreamForge
                </h3>

                <div className="d-flex align-items-center">

                    {user && (

                        <span className="text-white me-3">

                            Welcome, {user.username}

                        </span>

                    )}
                    <button
                         className="btn btn-info me-2"
                         onClick={() => navigate("/topology")}
                    >
                        Topology
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;