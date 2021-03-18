import React, { useContext, useEffect, useState, useRef} from "react";
import CardFeed from "../Components/CardFeed";
import "../App.css";
import Player from "../Components/Player";
import { Context } from "../store/appContext";
import { useHistory } from "react-router-dom";

function Feed() {
  const { store, actions } = useContext(Context);

  let formRef = useRef(null)

  const [state, setState] = useState({
    commentary: null,
    image: null
  })

  const history = useHistory();
  
  
  const handleChange = e => {
    let datos = state;
    datos[e.target.name] = e.target.value
    setState({ ...datos });
  }
  
  const handleChangeFile = e => {
    let datos = state;
    datos[e.target.name] = e.target.files[0]
    setState({ ...datos });
  }
  
  function handleSubmit () {/* 
    e.preventDefault(); */
    let formData = new FormData();
    formData.append('commentary', state.commentary);
    formData.append('image', state.image);
    formData.append('user_id', store.profile.id);
    formData.append('path', "D:/Mary/curso-4Geeks/Proyectos/react/proyecto-final/Base-React/public/img/post");
    
    
    actions.createPost(formData)
  }
  
  useEffect(() => {
    if (store.token === null) history.push("/login");
    actions.getPosts();
    actions.getLikesPost();
    actions.getCommentaryPost();
  }, []);

 

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md">
            <div className="card-header rounded-pill ">
              <div className="row">
                <div className="col-md-2">
                  <img
                    src={!!store.profile && store.profile.images[0].url}
                    id="feedAvatar"
                    alt="fotito"
                  />
                </div>
                <div className="col-md col-sm mt-3">
                  <input
                    className="text-white btn btn-rounded btn-lg btn-block bg-success rounded-pill mt-5"
                    type="button"
                    value="¿Que estas pensando?"
                    data-toggle="modal"
                    data-target="#exampleModal"
                  ></input>
                </div>
              </div>
            </div>
            <div className="row mb-2 mt-2">
              <div className="col-md col-sm">
                <ul>
                  {
                    
                    !!store.postList &&
                    store.postList.map((index, i) => {
                      return (
                        <CardFeed 
                        key={i} 
                        id={index.id} 
                        active={false}
                        user_id={index.user_id} 
                        likes={actions.likes(index.id) + " " + "Likes"} 
                        image={"./img/post/" + index.image} 
                        photo={index.photo} 
                        name={index.name} 
                        commentary={index.commentary} 
                        />
                      );
                    }).reverse()
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <form>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success">
                <h3
                  className="modal-title-center text-center text-white col-md-10 ml-4"
                  id="exampleModalLabel"
                >
                  Crear publicación
              </h3>
                <button
                  type="button"
                  className="close text-white col-md-2"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-3 ">
                    <img
                      src={!!store.profile && store.profile.images[0].url}
                      id="modalAvatar"
                      alt="fotito"
                    />
                  </div>
                  <div className="col-md-9  m-auto ">
                    <h5>{!!store.profile && store.profile.display_name}</h5>
                  </div>
                </div>


                <div className="form-group p-3 mt-3">
                  <textarea
                    ref={(r)=> (formRef=r)} 
                    className="w-100 border-0"
                    id="commentary"
                    name="commentary"
                    type="text"
                    placeholder="¿Que estas pensando?"
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="modal-footer form-group">
                  <input type="file" className="form-control" id="image" name="image" onChange={handleChangeFile} />
                  <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => {
                    handleSubmit();
                   /*  formRef.value=''; */
                    }}>
                    Post
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
export default Feed;
