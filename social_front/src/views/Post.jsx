import React from "react";
import "../styles/post/post.css";
import gus from "../static/gus.jpg";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
import SendIcon from "@material-ui/icons/Send";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import { Button, Icon, IconButton } from "@material-ui/core";
import { useParams } from "react-router";
import axios from "axios";

const Post = () => {
  const [post, setPost] = React.useState(null);
  const { id } = useParams();

  function getPost() {
    axios
      .get("/post", { params: { postId: id } })
      .then((res) => {
        console.log(res.data.data);
        setPost(res.data.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  React.useEffect(() => {
    getPost();
  }, [id]);

  return (
    <div>
      {post !== null && (
        <div className="my-5 d-flex justify-content-center">
          <article className="cardd">
            <div className="my-3">
              <img
                src={gus}
                style={{ verticalAlign: "middle" }}
                className="cardd-post-userimage"
              />
              <h4
                className="cardd-post-username"
                style={{ display: "inline-block" }}
              >
                {post.userId.name}
              </h4>
            </div>
            <img src={post.photo} alt="" className="cardd-post-image mx-5" />
            <div>
              <IconButton>
                <FavoriteIcon />
              </IconButton>
              <IconButton>
                <ChatIcon />
              </IconButton>
              <IconButton>
                <SendIcon />
              </IconButton>
              <IconButton style={{ float: "right" }}>
                <BookmarkBorderIcon />
              </IconButton>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default Post;
