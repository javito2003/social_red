import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import swal from "sweetalert";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import {withRouter} from 'react-router-dom'

const useStyles = makeStyles({
  card: {
    backgroundColor: "whitesmoke",
    width: 400,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.226)",
  },
});

const Login = (props) => {
    React.useEffect(() => {
        if (JSON.parse(localStorage.getItem('auth'))) {
            props.history.push('/')
            return
        }
    }, [])
  const styles = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(false);

  function login(e) {
    e.preventDefault();

    axios.post("/login", {email: email, password: password})
    .then(res => {
        if (res.data.status === 'success') {
            console.log(res.data);
            swal('Success', `Login success`, 'success')
            const auth = {
                token: res.data.token,
                userData: res.data.userData
            }
            localStorage.setItem('auth', JSON.stringify(auth))
            setTimeout(() => {
                window.location.reload()
            }, 1000)
            return
        }
    })
    .catch(err => {
        setEmail('')
        setPassword('')
        setAlert(true)
        setTimeout(() => {
            setAlert(false)
        }, 5000)
    })
  }
  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className={styles.card} style={{ marginTop: 150 }}>
          {alert && (
            <Alert severity="error" variant="filled">
              Email or password invalid
            </Alert>
          )}

          <h1 className="text-center my-3">Login</h1>
          <hr />
          <form className="my-2 mx-2" onSubmit={login}>
            <div className="mx-4">
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control my-2" />
            </div>
            <div className="mx-4">
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control my-2" />
            </div>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              className="my-3"
              type="submit"
            >
              Login!
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
