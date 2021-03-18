import React, { Fragment, StrictMode, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

function Player() {
  const { actions, store } = useContext(Context)

  const [url, setUrl] = useState()

  const [input, setInput] = useState()

  function cambio(e) {
    setInput(e.target.value);
  }

  return (
    <>
        <li className="nav-item ">
          <div className="input-group">
            <div className="input-group-prepend">
              <button className="input-group-text bg-success text-white" data-toggle="modal" data-target="#Player" id="inputGroup-sizing-default"
                onClick={() => {

                  actions.searchArtist(input)
                  /* actions.searchTracks(input) */
                  

                  /* if (store.artista === null) {
                    actions.searchTracks(input) 
                    setUrl(`https://open.spotify.com/embed/track/${store.albums.id}`)
                  }
                  else {
                    actions.searchArtist(input);
                    setUrl(`https://open.spotify.com/embed/album/${store.albums.id}`)
                  } */


                }}
              ><i className="fas fa-search"></i></button>
            </div>
            <input type="text" className="form-control" onChange={cambio} onKeyUp={(e) => {
              if (e.keyCode === 13) {

                
                /* if (store.tracks == null) {
                
                  actions.searchArtist(input);
                  setUrl(`https://open.spotify.com/embed/album/${store.albums.id}`)

                }
                else {
                  actions.searchTracks(input)
                  setUrl(`https://open.spotify.com/embed/track/${store.tracks.id}`)
                } */

              }
            }} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="Busca tu artista favorito" />
          </div>



          {/* <button type="button" className="btn btn-dark " data-toggle="modal" data-target="#Player">Buscar artista </button> */}
        </li>



        <div className="modal fade" id="Player" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">


                <div className="card-body text-center">

                  {
                    !!store.albums &&
                    store.albums.map((album, i) => {

                      let urlIDalbum = `https://open.spotify.com/embed/album/${album.id}`
                      /* let urlID = `https://open.spotify.com/embed/track/${album.id}` */



                      return (
                        <>
                          <iframe key={i}
                            src={urlIDalbum}
                            className="mb-3" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                        </>
                      )
                    })
                  }
                </div>

                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-success" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default Player;
