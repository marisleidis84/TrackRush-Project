import React from "react";
import Heading from "../Components/Heading";
import Heading2 from "../Components/Heading2";

function Home() {
  return (
    <>
      <div className="row p-5">
        <div className="container col-md ">
          <h1 className="titulo-h1 ml-5"> Hottest global 50 hits: </h1>
          <iframe
            src="https://open.spotify.com/embed/playlist/37i9dQZEVXbMDoHDwVN2tF"
            width="100"
            height="580"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media"
            className="col-md playerhome rounded"
          ></iframe>
        </div>

        <div className="container col-md">
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-ride="carousel"
          >
            <div className="carousel-inner rounded lilshadow">
              <div className="carousel-item active">
                <img
                  src="https://www.curacaonorthseajazz.com/-/media/northseajazz/curacao/program/2014/shot_03_172.jpg"
                  className="d-block w-100"
                  
                />
              </div>
              <div className="carousel-item">
                <img
                  src="https://www.interviewmagazine.com/wp-content/uploads/2019/05/Interview_2019_Web_Summer_BadBunny-05.jpg"
                  className="d-block w-100"
                  
                />
              </div>
              <div className="carousel-item">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paul_McCartney_2018_%28cropped%29.jpg"
                  className="d-block w-100"
                  
                />
              </div>
            </div>
            <a
              className="carousel-control-prev"
              href="#carouselExampleControls"
              role="button"
              data-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="carousel-control-next"
              href="#carouselExampleControls"
              role="button"
              data-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
        <div className="container-fluid p-3">
          <Heading />
          <Heading2 />
        </div>
      </div>
    </>
  );
}

export default Home;
