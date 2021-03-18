import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";

function Token() {
  const { store, actions } = useContext(Context);

  const history = useHistory();

  useEffect(() => {
    
    actions.getToken(history);

  }, []);

  return (
    <>
      <div className="d-flex align-items-center">
        <strong>Loading...</strong>
        <div
          className="spinner-border ml-auto"
          role="status"
          aria-hidden="true"
        ></div>
      </div>
    </>
  );
}

export default Token;
