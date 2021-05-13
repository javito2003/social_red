import React, { useState } from "react";
import { Button } from "@material-ui/core";
import swal from "sweetalert";
import { makeStyles } from "@material-ui/styles";
import {withRouter} from 'react-router-dom'
import axios from "axios";

const useStyles = makeStyles({
  flex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "75vh",
  },
  card: {
    backgroundColor: "whitesmoke",
    width: 400,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.226)",
  },
});

const Register = (props) => {
  React.useEffect(() => {
    if (JSON.parse(localStorage.getItem('auth'))) {
        props.history.push('/')
        return
    }
}, [])
  const styles = useStyles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonHabilited, setButtonHabilited] = useState(true);
  const [emailUsed, setEmailUser] = useState(false)

  // Example starter JavaScript for disabling form submissions if there are invalid fields
  function register(e) {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    if (name.trim().length < 5) {
      console.log("Name should must than 5 characters");
      return;
    }
    if (!email.trim()) {
      console.log("Email is required");
      return;
    }
    if (!password.trim()) {
      console.log("Password is required");
      return;
    }
    if (password.trim().length < 6) {
      console.log("Password should must than 6 characters");
      return;
    }

    const toCreate = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post("/register", toCreate)
      .then((res) => {
        console.log(res.data);
        swal("Good job", "Register success", "success");
        setTimeout(() => {
          props.history.push('/login')

        }, 2000)
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data.message.message === "User validation failed: email: Error, email already exists") {
          setEmailUser(true)
          setEmail('')
          return
        }
        swal("Register error", "Error to register", "error");
      });
  }
  return (
    <div>
      <div>
        <div className="d-flex justify-content-center">
          <div className={styles.card} style={{ marginTop: 150 }}>
            <h1 className="text-center my-3">Register</h1>
            <hr />
            <form onSubmit={register}>
              <div className="mb-4 mx-4">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                />
                {name.trim().length < 5 ? (
                  <span style={{ color: "red" }}>
                    <small>
                      The name should be must than 5 characters{" "}
                      {name.trim().length}/5
                    </small>
                  </span>
                ) : (
                  <span style={{ color: "green" }}>
                    <small>Success</small>
                  </span>
                )}
              </div>
              <div className="mb-4 mx-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                />
                {
                  emailUsed && <span style={{color: "red"}}><small>Email already used</small></span>
                }
              </div>
              <div className="mb-4 mx-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
                {password.trim().length < 6 ? (
                  <span style={{ color: "red" }}>
                    <small>The password should be must than 6 characters</small>
                  </span>
                ) : (
                  <span style={{ color: "green" }}>
                    <small>Success</small>
                  </span>
                )}
              </div>
              <Button
                color="secondary"
                variant="contained"
                className="my-3"
                fullWidth
                type="submit"
              >
                Register
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Register);