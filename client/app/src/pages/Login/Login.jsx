import { useEffect, useState } from "react";
import "./login.css";
import {useGoogleLogin} from "@react-oauth/google"
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (profile.length !== 0) {
     // localStorage.setItem("user", JSON.stringify(profile));

      handleLoginAttempt();
      console.log(profile); 
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);
  let navigate = useNavigate();
  async function handleLoginAttempt(e) {
    try {
      const adjustedProfile = {
        name: profile.name,
        email: profile.email,
      };
  
      // Check if user exists by making a GET request to the backend endpoint
      const userExistsResponse = await axios.get(`http://localhost:5555/users/${profile.email}`);
  
      if (userExistsResponse.status === 200) {
        // User exists, extract userId from the response
        const existingUser = userExistsResponse.data;
        localStorage.setItem("user", JSON.stringify(existingUser)); // Store userId in localStorage
        navigate("/home");
      } else if (userExistsResponse.status === 404) {
        // User does not exist, create a new user
        const response = await axios.post("http://localhost:5555/users", adjustedProfile);
        const newUser = response.data; // New user object returned by the server
        localStorage.setItem("user", JSON.stringify(newUser)); // Store userId in localStorage
        navigate("/home");
      }
    } catch (error) {
      // Handle network or other errors
      console.log(error);
    }
  }
  
 
  return (
    <div className="login">
      <div className="login__illustration">
        <img
          className="illustration__image2"
          src={require("../../assets/login_illustration.png")}
          alt="phot"
        />
      </div>
      <div className="login__input-area">
        <div className="input-area__header">
          <h2>Welcome to OppNet</h2>
          <h4>Login below!</h4>
        </div>
        <div className="input-area__inputs">
          <div className="inputs__label-input-card">
            <label>Username</label>
            <input type={"text"} placeholder="abc123@lehigh.edu"></input>
          </div>
          <div className="inputs__label-input-card">
            <label>Password</label>
            <input type={"text"} placeholder="Password"></input>
          </div>

          <div className="inputs__login-buttons">
            <button>Login</button>
            <button onClick={login}>Sign in with Google</button>
          </div>
        </div>
        <div className="input-area__footer"></div>
      </div>
    </div>
  );
}

export default Login;
