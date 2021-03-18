import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../App.css";
import { Context } from "../store/appContext";

function Profile() {
  const { store, actions } = useContext(Context);

  const history = useHistory();

  useEffect(() => {
    if (store.profile === null) history.push("/login");

    
  }, []);

  return (
    <>
      <div
        className="card border-success mb-3 m-auto shadow"
        style={{ "max-width": "38rem" }}
      >
        <div className="card-header bg-success border-success py-3">
          <img
            src={!!store.profile && store.profile.images[0].url}
            alt="Avatar"
            id="profileAvatar"
          />
          <h1 className="text-white d-inline-block ml-4">
            {!!store.profile && store.profile.display_name}
          </h1>
        </div>
        <div className="card-body list-group-flush">
          <li className="list-group-item border-success ">
            <i class="fas fa-users"></i>{" "}
            {!!store.profile && store.profile.followers.total} Seguidores 
          </li>
          <li className="list-group-item border-success">
            <i class="fas fa-music mt-2 mb-3"></i> Recientes
            {!!store.profile &&
              store.recentTracks.items.slice(0, 5).map((index, key) => {
                return (
                  <>
                    <span
                      key={key}
                      type="button"
                      class="btn btn-success mx-1 ml-2 mt-2 mb-2 rounded-pill shadow"
                    >
                      {index.track.name} - {index.track.artists[0].name}
                    </span>
                  </>
                );
              })}
          </li>
          <li className="list-group-item border-success">
            <i class="fas fa-microphone mt-2 mb-2"></i> Top Artistas
            {!!store.profile &&
              store.topArtists.items.slice(0, 4).map((index, key) => {
                return (
                  <>
                    <p
                      className="bg-success text-white rounded p-2 ml-3 profiledown"
                      key={key}
                    >
                      <span className="mr-4">
                        <img
                          src={index.images[0].url}
                          className="rounded-circle w-25"
                        />
                      </span>
                      {index.name}{" "}
                    </p>
                  </>
                );
              })}
          </li>
        </div>
      </div>
    </>
  );
}

export default Profile;
