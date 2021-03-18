import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Socket } from "socket.io-client";
import Player from "../Components/Player";
import RoomChat from "../Components/RoomChat";
import { Context } from "../store/appContext";
import Friends from "./Friends";
import { io } from "socket.io-client";

function Chat(props) {
  const { store, actions } = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if (store.profile === null) history.push("/login");
    actions.getFriends()
  }, []);

  return (
    <>
        <div className="row">
          <div className="col-4">
            <div className="list-group" id="list-tab" role="tablist">
              {!!store.followingDB &&
                store.followingDB.length > 0 ?
                store.followingDB.map((value, i) => {

                  let href = `#${value.personId}`;
                  //let chatID = `/chats/${value.personId}`

                  return (
                    <h4
                      key={i}
                      className="list-group-item list-group-item-action"
                      id="list-profile-list"
                      data-toggle="list"
                      href={href}
                      role="tab"
                      aria-controls="profile"
                    >
                      <img
                        src={value.photo}
                        id="friendAvatar"
                        className="mr-4"
                      />
                      {value.friends}
                    </h4>
                  );
                }) : (
                  <h1>No hay amigos aún...</h1>
                )
              }
            </div>
          </div>
          <div className="col-8">
            <div className="tab-content" id="nav-tabContent">
              {!!store.followingDB &&
                store.followingDB.map((value, i) => {

                  let chatID = `/chats/${value.personId}`

                  return (
                    <>
                      <div
                        key={i}
                        className="tab-pane fade"
                        id={value.personId}
                        role="tabpanel"
                        aria-labelledby="list-profile-list"
                      >
                        <Link to={chatID} style={{ textDecoration: 'none' }}>
                          <RoomChat username={value.friends} />
                        </Link>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
    </>
  );
}

export default Chat;
