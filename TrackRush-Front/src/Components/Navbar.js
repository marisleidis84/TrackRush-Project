import React, { useContext, useEffect } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import { Context } from "../store/appContext";
import Player from "./Player";

function Navbar() {
  const { store, actions } = useContext(Context);
  const history = useHistory();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-5">
        <div className="container">
          <Link className="navbar-brand bg-dark px-3 rounded-pill logo" to="/">
            <strong className='rock'>
              Track<span className='text-danger rock'>Rush</span> <i className="fas fa-podcast"></i>
            </strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            {!!store.profile &&
              store.profile ? (
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                  <li className="nav-item ">
                    <Link className="nav-link" to="/feed">
                      <strong>Feed</strong>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/people">
                      <strong>People</strong>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/chats">
                      <strong>Chats</strong>
                    </Link>
                  </li>


                </ul>) : (null)}
            {
              !!store.profile &&
                store.profile ? (
                  <>
                    <ul className="navbar-nav mt-2 mt-lg-0">
                      <li className="nav-item">
                        <Player />
                      </li>
                    </ul>

                    <div className="dropdown">
                      <a className="btn btn-success dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-user-circle m-0"></i>
                      </a>

                      <div className="dropdown-menu ml-auto" aria-labelledby="dropdownMenuLink">
                        <Link className="dropdown-item" to="/profile">Profile</Link>
                        <button className="dropdown-item" onClick={() => actions.logOut(history)}>Log Out </button>

                        <div className="dropdown-menu ml-auto" aria-labelledby="dropdownMenuLink">
                          <Link className="dropdown-item" to="/profile">Profile</Link>
                          <button className="dropdown-item" onClick={() => actions.logOut(history)}>Log Out </button>
                        </div>

                      </div>
                    </div>

                  </>) : (
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                      <Link className="nav-link" id="login" to="/login">
                        <strong>Login</strong>
                      </Link>
                    </li>
                  </ul>
                )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default withRouter(Navbar);
