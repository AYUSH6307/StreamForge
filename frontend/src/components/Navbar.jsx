import { Link } from "react-router-dom";


function Navbar(){

  return(

    <nav className="navbar navbar-dark bg-dark">

      <div className="container">

        <Link 
          className="navbar-brand"
          to="/"
        >
          StreamForge
        </Link>


        <div>

          <Link 
            className="text-white mx-3"
            to="/"
          >
            Dashboard
          </Link>


          <Link 
            className="text-white mx-3"
            to="/streams"
          >
            Streams
          </Link>


          <Link 
            className="text-white mx-3"
            to="/create"
          >
            Create Stream
          </Link>


          <Link 
            className="text-white mx-3"
            to="/profile"
          >
            Profile
          </Link>

        </div>

      </div>

    </nav>

  )

}


export default Navbar;