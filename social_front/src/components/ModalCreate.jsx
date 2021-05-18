import React, { useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { useSelector } from "react-redux";
import axios from "axios";
import EventEmitter from "../utils/EventEmitter";
import swal from "sweetalert";
import Backdrop from "@material-ui/core/Backdrop";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import "../styles/modal.css";
import { useSpring, animated } from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import socket from "../utils/ws";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "white",
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 1, 2),
  },
  image: {
    marginTop: 20,
    width: 500,
    height: "auto",
  },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

export default function SpringModal() {
  const user = useSelector((store) => store.user.user);
  const classes = useStyles();
  const [getUserState, setGetUserState] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function createPost(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("description", description);
    data.append("file", image);
    let config = {
      headers: {
        token: user.token,
      },
    };
    axios
      .post("/post", data, config)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === "success") {
          swal("Success", "Create post success", "success");
          EventEmitter.emit("getPosts");
          setImage("");
          socket.emit("new-post", getUserState.followers);
          setDescription("");
          setOpen(false);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  function getUser() {
    axios
      .get("/user", { params: { userId: user.userData._id } })
      .then((res) => {
        console.log(res.data);
        setGetUserState(res.data.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  React.useEffect(() => {
    socket.on("updateProfile", () => {
      getUser();
    });
    getUser();
  }, []);

  return (
    <div>
      <Button
        type="button"
        color="primary"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Create post
      </Button>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="spring-modal-title">Create Post</h2>
            <hr />
            <form onSubmit={createPost}>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                ></textarea>
              </div>
              <div className="my-4">
                <label className="form-label">Insert image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                />
                {image && (
                  <img
                    className={classes.image}
                    src={image ? URL.createObjectURL(image) : null}
                    alt="image selected"
                  />
                )}
              </div>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                type="submit"
              >
                Create post
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
