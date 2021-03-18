import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import socketIOClient from "socket.io-client";
import { Context } from "../store/appContext";


const socket = io("http://localhost:5000/");
socket.on("connect", () => {
    socket.emit("connected", "CONECTADO FRONT");
});


function RoomChat(props) {
    const { store, actions } = useContext(Context);
    const [arrayMsg, setArrayMsg] = useState([]);


    useEffect(() => {

        socket.on("response", (msg) => {
            console.log(msg);
            setArrayMsg(arrayMsg.concat(msg));
        });

    }, [arrayMsg])

    const handleMessage = (e) => {
        if (e.keyCode === 13) {
            console.log(e.target.value);

            let datos = {
                message: e.target.value,
                username: store.profile.display_name,
            };

            socket.send(datos);
            e.target.value = "";
        }
    };



    return (
        <>
            <div className="col-md-6">
                <div className="card w-100 h-75 ">
                    <div className="card-body bg-success">
                        <h5 className="card-title text-white ">
                            <i className="fas fa-camera"></i> {props.username}
                        </h5>

                        {
                            !!arrayMsg &&
                            arrayMsg.map((valor, i) => {
                                return (
                                    <>
                                        <p key={i} className="card-text text-white bubble">
                                            <strong className="">{valor.username} :</strong> {valor.message}
                                        </p>
                                    </>
                                );
                            })
                        }

                    </div>
                    <div className="card-footer bg-dark">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control "
                                placeholder="Envia un mensaje"
                                onKeyUp={handleMessage}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-dark bg-success text-white"
                                    type="button"
                                    onClick={handleMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RoomChat;
