import React, { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../App.css";
import { Context } from "../store/appContext";

function Comments(props) {

    const { store, actions } = useContext(Context);

    return(
        <>
            <div className="input-group mt-3">
                <div className="input-group-prepend col-2">
                    <img className="input-group rounded-pill img-fluid" src={props.imgComments} id="basic-addon1"/>
                </div>
                <div className="container-fluid bg-white rounded-pill border" style={{"width":"23em"}}>
                    <strong className="mt-1 ml-2 rounded-pill">{props.nameComments}</strong>
                    <div className="ml-2 mb-1 rounded-pill">{props.comments}</div>
                </div>
            </div>
        </>
    )
}
export default Comments;