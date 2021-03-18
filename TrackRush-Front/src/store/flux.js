import { get } from "jquery";
import { token } from "../Views/Feed";
const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      otherProfile: null,
      tracks: null,
      albums: null,
      artista: null,
      token: null,
      profile: null,
      error: null,
      recentTracks: null,
      topArtists: null,
      otherFollowersID: null,
      postList: [],
      followingDB: [],
      following: [],
      userdb: [],
      likesPost: null,
      active: false,
      commentsPost: null,
      REACT_APP_CLIENT_ID: "e6dd68b952104e71a1d03485ee664366",
      REACT_APP_AUTHORIZE_URL: "https://accounts.spotify.com/authorize",
      REACT_APP_REDIRECT_URL: "http://localhost:3000/tokenlogin2171",
    
      REACT_BACKEND_API: "http://localhost:5000/api/"
    },
    actions: {
      isAuthenticated: () => {
        if (sessionStorage.getItem("access_token")) {
          setStore({
            token: sessionStorage.getItem("access_token"),
          });
        }
      },

      handleLogin: () => {
        let store = getStore();
        window.location = `${store.REACT_APP_AUTHORIZE_URL}?client_id=${store.REACT_APP_CLIENT_ID}&redirect_uri=${store.REACT_APP_REDIRECT_URL}&response_type=token&show_dialog=true&scope=user-read-private%20user-read-email%20playlist-read-private%20user-follow-read%20user-read-recently-played%20user-read-playback-state%20user-read-currently-playing%20user-top-read%20user-follow-modify%20user-follow-read&state=34fFs29kd09`;
      },

      getToken: (history) => {
        let hash = window.location.hash;
        let hashResultante = hash.split("&");
        let token = hashResultante[0].replace("#access_token=", "");

        setStore({
          token: token,
        });

        sessionStorage.setItem("access_token", token);

        history.push("/feed");
      },

      getUserData: () => {
        let store = getStore();
        fetch("https://api.spotify.com/v1/me", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${store.token}`,
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            if (!data.error) {
              setStore({
                profile: data,

              });
              getActions().getUserdb();
            } else {
              setStore({
                error: data.error,
              });
            }
          })
          .catch((error) => console.error(error));

        getActions().getUserRecentTracks();
        getActions().getUserTopArtists();
      },

      checkUser: () => {
        const { profile, userdb } = getStore();
        console.log( profile );
        console.log( userdb );
        if (profile !== null && userdb !== null) {
          const user = userdb.find((user) => profile.id === user.user_id);
          if (user) {
            getActions().getUserDataPut(profile.id);
          } else {
            getActions().getUserDataPost();
          }
        }
      },

      getUserdb: () => {
        fetch("http://localhost:5000/api/users/", {
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            setStore({
              userdb: data,
            });

            getActions().checkUser();
          })
          .catch((error) => console.error(error));
      },

      getUserDataPost: () => {
        let store = getStore();
        
        fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: store.profile.id,
            name: store.profile.display_name,
            email: store.profile.email,
            followers: store.profile.followers.total,
            photo: store.profile.images[0].url,
            recentTracks: store.recentTracks,
            topArtists: store.topArtists,
          }),
        })
          .then((resp) => resp.json())
          .then((data) => console.log(data));
      },

      getUserDataPut: (id) => {
        let store = getStore();
        fetch(`http://localhost:5000/api/user/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: store.profile.display_name,
            email: store.profile.email,
            followers: store.profile.followers.total,
            photo: store.profile.images[0].url,
            recentTracks: store.recentTracks,
            topArtists: store.topArtists,
          }),
        })
          .then((resp) => resp.json())
          .then((data) => console.log(data));
      },

      getUserDataOther: (slug) => {
        fetch(`http://localhost:5000/api/user/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            setStore({
              otherProfile: data,
            });
          });
      },

      getUserRecentTracks: () => {
        let store = getStore();
        fetch("https://api.spotify.com/v1/me/player/recently-played", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${store.token}`,
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((data) =>
            setStore({
              recentTracks: data,
            })
          )
          .catch((error) => console.error(error));
      },

      getUserTopArtists: () => {
        let store = getStore();
        fetch("https://api.spotify.com/v1/me/top/artists", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${store.token}`,
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((data) =>
            setStore({
              topArtists: data,
            })
          )
          .catch((error) => console.error(error));
      },

      searchArtist: (input) => {
        let store = getStore();
        fetch(
          `https://api.spotify.com/v1/search?query=${input}&type=artist&market=US&limit=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${store.token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            
            setStore({
              artista: data.artists.items[0],
            });
            getActions().getAlbumArtists();
          })
          .catch((error) => console.error(error));
      },

      getAlbumArtists: () => {
        let store = getStore();
        fetch(
          `https://api.spotify.com/v1/artists/${store.artista.id}/albums?market=US&limit=30`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const albums = data.items;
            console.log("artista", albums)

            setStore({
              albums: albums,
            });
          });
      },

      searchTracks: (input) => {
        let store = getStore();

        fetch(
          `https://api.spotify.com/v1/search?q=${input}&type=track&market=US&limit=10`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((resp) => resp.json())
          .then((data) => {
            console.log("tracks" , data.tracks.items)
            setStore({
              tracks: data.tracks.items,
            });
          })
          .catch((error) => console.error(error));
      },

      logOut: (history) => {
        sessionStorage.removeItem("access_token");
        setStore({
          profile: null,
          token: null,
          error: null,
          userdb:null,
        });
        history.push("/login");
      },

      createPost: (form) => {
        console.log("create post")

        fetch("http://localhost:5000/api/posts", {
          method: "POST",
          body: (form)
        })
          .then((resp) => resp.json())
          .then(() => {
            getActions().getPosts();
          })

          .catch((error) => console.error(error));
      },

      getPosts: () => {
        fetch("http://localhost:5000/api/posts", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((resp) => resp.json())
        .then((data) => {
          setStore({
            postList: data,
          });
        })
        .catch((error) => console.error(error));
      },

      likesPost: (id) => {
        let store = getStore();
        fetch("http://localhost:5000/api/likespost/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },  
          body: JSON.stringify({
                likes: 1,
                active: true,
                post_id: id,
                user_id: store.profile.id
          }),
        })
          .then((resp) => resp.json())
          .then(() => {
            getActions().getLikesPost()
            getActions().activeLike(id)
          })

          .catch((error) => console.error(error));
      },

      getLikesPost: () => {
        fetch("http://localhost:5000/api/likespost/",{
          method: "GET",
          headers: { "Content-Type": "application/json"}
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log("dataaaaaaaaaaa", data)
              setStore({
                likesPost: data
              })
          })
      },

      likes: (id) => {
        let store = getStore();
        return store.likesPost ? store.likesPost.filter(valor => valor.post_id == id).length:0
      },

      activeLike: (id) => {
        let store = getStore();
        store.likesPost.filter(valor => valor.post_id == id & store.likesPost.active == true)
           return setStore({
                  active: true
            })
      },

      commentaryPost: (id, commentary) => {
        let store = getStore();
        fetch("http://localhost:5000/api/commentspost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },  
          body: JSON.stringify({
                commentary: commentary,
                post_id: id,
                user_id: store.profile.id
          }),
        })
          .then((resp) => resp.json())
          .then(() => {
            getActions().getCommentaryPost();
          })

          .catch((error) => console.error(error));
      },

      getCommentaryPost: () => {
        fetch("http://localhost:5000/api/commentspost/",{
          method: "GET",
          headers: { "Content-Type": "application/json"}
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log("dataaaaaaaaaaa", data)
              setStore({
                commentsPost: data
              })
          })
      },

      getFollowId: (id) => {
        let store = getStore();
        fetch(
          `https://api.spotify.com/v1/me/following/contains?type=user&ids=${id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${store.token}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((resp) => resp.json())
          .then((data) => {
            setStore({
              followId: data,
            });
          });
      },

      followUser: (id) => {
        let store = getStore();
        fetch(`https://api.spotify.com/v1/me/following?type=user&ids=${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${store.token}`,
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then((resp) => resp.json())
          .then((data) => {
            getActions().getOtherFollowers(id);
          })
          .catch((error) => console.error(error));
      },

      unFollowUser: (id) => {
        let store = getStore();
        fetch(`https://api.spotify.com/v1/me/following?type=user&ids=${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${store.token}`,
            "Content-Type": "application/json",
          },
          method: "DELETE",
        })
          .then((resp) => resp.json())
          .then((data) => {
            getActions().getOtherFollowers(id);
          })
          .catch((error) => console.error(error));
      },

      getOtherFollowers: (id) => {
        let store = getStore();
        fetch(`https://api.spotify.com/v1/users/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${store.token}`,
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log(data);
            setStore({
              otherFollowersID: data,
            });
          })
          .catch((error) => console.error(error));
      },

      postFriends: (name, photo, personId) => {
        let store = getStore();
          fetch(`http://localhost:5000/api/friends/`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                  friends: name,
                  user_id: store.profile.id,
                  personId: personId,
                  photo: photo,
            }),
          })
            .then((resp) => resp.json())
            .then(() => {
               getActions().getFriends();
            });
        /* }); */
      },

      getFriends: () => {
        let store = getStore();
        fetch(`http://localhost:5000/api/friends/${store.profile.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            setStore({
              followingDB: data,
            });
          });
      },
      deleteFriend: (id) => {
        let store = getStore();
        fetch(`http://localhost:5000/api/friends/${store.profile.id}/${id}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then(() => {
            getActions().getFriends();
          });
      },
    },
  };
};

export default getState;
