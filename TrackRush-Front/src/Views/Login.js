import React, { useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Context } from '../store/appContext';

function Login() {

    const { store, actions } = useContext(Context);

    const history = useHistory();

    useEffect(() => {
        if (store.token !== null) {
            history.push('/feed');
        }
    }, []);

    return (
        <>
            <div className="col-md" style={{ "padding": "188px" }}>
                <div className="card m-auto border border-success p-5 col-md loginbox" style={{ "max-width": "750px" }}>
                    <div className="row no-gutters">

                        <img src="./img/img-login.jpg" className="img-fluid mb-3" />

                        <div className="col-md">
                            <div className="card-body col-md">
                                <h4 className="card-title mt-5"><i className="fab fa-spotify text-success"></i> Sign into your account</h4>
                                <button className="btn btn-success mt-5 col-md rounded-pill" onClick={actions.handleLogin}><strong>Login</strong></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;
