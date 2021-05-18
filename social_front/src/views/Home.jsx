import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/login.css";
import { Button, Icon, IconButton } from "@material-ui/core";
import gus from "../static/gus.jpg";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from '@material-ui/icons/Chat';
import SendIcon from '@material-ui/icons/Send';
import MarkunreadIcon from '@material-ui/icons/Markunread';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import axios from 'axios'
import socket from '../utils/ws'
import {getNotifications} from '../redux/notifDucks'

//components
import ModalCreate from '../components/ModalCreate'
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch()
  const [posts, setPosts] = useState([])
  const user = useSelector((store) => store.user.user.userData);
  const token = useSelector((store) => store.user.user.token)
  const notifications = useSelector(store => store.notifications.notifications)
  
  function readNotification(notifId){
    let config = {
      headers: {
        token: token
      },
      params:{
        notifId: notifId
      }
    }

    axios.put('/notification-read', null, config)
    .then(res => {
      console.log(res.data);
      dispatch(getNotifications())
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  function getPosts(){
    axios.get('/posts')
    .then(res => {
      console.log(res.data);
      setPosts(res.data.data)
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  React.useEffect(() => {
    getPosts()
    if (user) {
      socket.on('usernames', data => {
        console.log(data);
      })
    }
  }, [])
  
  console.log(posts);
  
  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="card my-3">
          <div className="card-body">
            <h1 className="text-center">Hi {user.name}</h1>
            <img src={gus} className="card-body-img my-1" />
            <div className="card-footer">
              <div className="card-footer-options mx-2">
                <ModalCreate/>
              </div>
              <div className="card-footer-options mx-2">
                <Link style={{textDecoration: 'none'}} to={`/profile/${user._id}`}>
                  <Button variant="contained" color="secondary">Go to the profile</Button>
                
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card my-3 mx-1">
          <h2 className="text-center my-2">Notifications</h2>
          <hr />
          <div className="notifications">
            {
              <div>
                {
                  notifications.length === 0 ? <p className="text-center">You don't have notifcations</p> :
                  notifications.map(item => (
                    
                    <div key={item._id} className="mx-4"> {item.description} <IconButton onClick={() => readNotification(item._id)}><MarkunreadIcon/></IconButton></div>
                ))
                }
              </div>
            }  
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="card-post my-3" >
        {
          posts.map(row => (
          <div className="mx-3" key={row._id}>
            <div className="my-3">
              <img
                src={gus}
                className="card-post-userimage"
                style={{ verticalAlign: "middle" }}
              />
              <h4
                className="card-post-user"
                style={{ display: "inline-block" }}
              >
                <Link style={{textDecorationLine: "none", color: "#000"}} to={`/profile/${row.userId._id}`}>
                {
                  user.name === row.userId.name ? 'me' : row.userId.name
                }
                </Link>
              </h4>
            </div>
            <div>
              <img src={row.photo} className="card-post-image" />
            </div>
            <div>
              <IconButton color="secondary">
                <FavoriteIcon />
              </IconButton>
              <IconButton>
                <ChatIcon/>
              </IconButton>
              <IconButton>
                <SendIcon/>
              </IconButton>
              <IconButton style={{float: "right"}}>
                <BookmarkBorderIcon/>
              </IconButton>
            </div>
          </div>
          ))
        }
        </div>
        
      </div>
    </div>
  );
};

export default Home;
