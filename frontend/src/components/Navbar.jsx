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

                console.log(
                    "Unable to load current user:",
                    error
                );

            }

        };

        fetchUser();

    }, []);

    return (

        <header className="top-navbar">

            {/* LEFT */}

            <div
                className="top-navbar-brand"
                onClick={() => navigate("/dashboard")}
            >

                <span className="brand-icon">
                    ⚡
                </span>

                <span>
                    StreamForge
                </span>

            </div>


            {/* RIGHT */}

            <div className="top-navbar-user">

                {user && (

                    <span className="welcome-user">

                        Welcome,{" "}

                        <strong>
                            {user.username}
                        </strong>

                    </span>

                )}

            </div>

        </header>

    );

}

export default Navbar;