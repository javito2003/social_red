import React, { useEffect, useState } from "react";
import "../styles/profile/profile.css";
import portada from "../static/star.png";
import gus from "../static/gus.jpg";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import DoneIcon from "@material-ui/icons/Done";
import saveInLocalStorage from "../utils/saveLocalStorage";
import socket from "../utils/ws";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState(null);
  const [follow, setFollow] = useState(true);
  const getUser = () => {
    let config = {
      params: {
        userId: id,
      },
    };
    axios
      .get("/user", config)
      .then((res) => {
        setUser(res.data.data);
        setPosts([res.data.data.postsId]);
        let data = res.data.data;
        console.log(data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  function followUser() {
    let config = {
      headers: {
        token: token,
      },
      params: {
        followUserID: id,
      },
    };
    axios
      .put("/follow", null, config)
      .then((res) => {
        console.log(res.data);
        saveInLocalStorage(token, res.data.data);
        setFollow(false);
        socket.emit("update", "hey");
        const toSend = {
          _id: id,
          name: userStore.name,
        };
        console.log(toSend);
        socket.emit("follow", toSend);
        getUser();
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  function unFollowUser() {
    let config = {
      headers: {
        token: token,
      },
      params: {
        unFollowUserID: id,
      },
    };
    axios
      .put("/unfollow", null, config)
      .then((res) => {
        console.log(res.data);
        saveInLocalStorage(token, res.data.data);
        setFollow(true);
        socket.emit("update", "hey");
        getUser();
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  function checkIfFollowUser() {
    const followings = userStore.following;
    const searchFollowing = followings.find((follow) => follow === id);
    if (searchFollowing) {
      console.log(searchFollowing);
      setFollow(false);
    }
  }

  const token = useSelector((store) => store.user.user.token);
  const userStore = useSelector((store) => store.user.user.userData);
  useEffect(() => {
    getUser();
    socket.on("updateProfile", () => {
      getUser();
    });

    if (userStore._id !== id) {
      checkIfFollowUser();
    }
  }, [id]);
  return (
    <div>
      {!user ? null : (
        <div className="my-5 d-flex justify-content-center">
          <article className="cardd">
            <img src={portada} alt="portada" className="cardd-header" />
            <div className="cardd-body">
              <img src={gus} alt="Profile imagen" className="cardd-body-img" />
              <h1 className="cardd-title">{user.name}</h1>
              {userStore._id === id ? (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SettingsIcon />}
                >
                  Edit Profile
                </Button>
              ) : (
                <div>
                  {follow ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={followUser}
                    >
                      Follow
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DoneIcon />}
                      onClick={unFollowUser}
                    >
                      Following
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="cardd-footer">
              <div className="cardd-footer-data">
                {user.postsId !== undefined && <h3>{user.postsId.length}</h3>}
                <p>Posts</p>
              </div>
              <div className="cardd-footer-data">
                {user.followers !== undefined && (
                  <h3>{user.followers.length}</h3>
                )}
                <p>Followers</p>
              </div>
              <div className="cardd-footer-data">
                {user.following !== undefined && (
                  <h3>{user.following.length}</h3>
                )}
                <p>Follows</p>
              </div>
            </div>
            <div className="row">
              <div className="cardd-posts">
                {posts
                  ? posts[0].map((item, index) => (
                      <Link to={`/post/${item._id}`}>
                        <img
                          key={index}
                          src={item.photo}
                          alt="post image"
                          className="cardd-posts-img mx-2 my-2"
                        />
                      </Link>
                    ))
                  : null}
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default Profile;
