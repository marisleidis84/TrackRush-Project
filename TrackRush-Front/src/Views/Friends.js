import React, { useContext, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Player from "../Components/Player";
import { Context } from "../store/appContext";

function Friends(props) {
  const { store, actions } = useContext(Context);
  const history = useHistory();
  const { slug } = useParams();

  useEffect(() => {
    if (store.profile === null) history.push("/login");
    actions.getUserdb()
  }, []);

  let urlID = `/profile/${store.postList.user_ids}`;

  return (
    <>
      <div className="row">
        <div className="col-md">
          <div className="list-group">
            {!!store.userdb &&
              store.userdb.map((valor, index) => {
                let profileID = `/profile/${valor.user_id}`;
                if (store.profile.id === valor.user_id) {
                  return (
                    <div className="row">
                      <Link
                        key={index}
                        className="list-group-item list-group-item-action d-flex justify-content-start"
                        to="/profile"
                      >
                        <img
                          className="rounded-circle"
                          src={valor.photo}
                          style={{ width: "100px" }}
                        />{" "}
                        &nbsp; &nbsp; &nbsp;
                        <h4 className="mt-4 ">{valor.name}</h4>
                      </Link>
                    </div>
                  );
                } else {
                  return (
                    <div className="row">
                      <Link
                        key={index}
                        className="list-group-item list-group-item-action d-flex justify-content-start"
                        to={profileID}
                      >
                        <img
                          className="rounded-circle"
                          src={valor.photo}
                          style={{ width: "100px" }}
                        />{" "}
                        &nbsp; &nbsp; &nbsp;
                        <h4 className="mt-4 ">{valor.name}</h4>
                      </Link>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Friends;

