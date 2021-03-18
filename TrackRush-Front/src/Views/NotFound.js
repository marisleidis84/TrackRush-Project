import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div id='containerNotFound'>
            <h1 className='d-flex justify-content-center'>Error 404</h1>
            <Link to="/">
                <button className="btn btn-success btn-lg w-100 d-flex mb-5 mt-5">
                    <span className='mx-auto p-2'>Oops... Nothing found. Click here to go back home</span>
                </button>
            </Link>
        </div>
    )
}

export default NotFound
