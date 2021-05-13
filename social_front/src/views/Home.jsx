import React from "react";
import { useSelector } from "react-redux";
import "../styles/login.css";
import { Button, Icon, IconButton } from "@material-ui/core";
import gus from "../assets/gus.jpg";
import AddIcon from "@material-ui/icons/Add";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from '@material-ui/icons/Chat';
import SendIcon from '@material-ui/icons/Send';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

//components
import ModalCreate from '../components/ModalCreate'

const Home = () => {
  const user = useSelector((store) => store.user.user.userData);
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
              <div className="card-footer-options">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                >
                  Create post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="card-post my-3">
          <div className="mx-3">
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
                Name
              </h4>
            </div>
            <hr />
            <div>
              <img src={gus} className="card-post-image" />
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
        </div>
      </div>
    </div>
  );
};

export default Home;
