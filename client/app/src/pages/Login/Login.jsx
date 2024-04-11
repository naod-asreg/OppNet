import React, { useContext } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { UserContext } from "../../App";
function Login() {
  const navigate = useNavigate();
  const {setToken, setCurrentUser} = useContext(UserContext)
  // Google OAuth login configuration
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        // Send Google OAuth access token to backend for validation

        const response = await fetch(
          "http://localhost:5555/users/google-auth",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken: JSON.stringify(codeResponse.access_token),
            }),
          }
        );
        // Assuming the backend returns a JWT token upon successful validation
        let result = await response.json()
        console.log(result)

        const token = result.token
        const user = result.user
       

        // Store the JWT token securely (e.g., in an HTTP-only cookie)
        // For simplicity, let's assume storing it in local storage for now
        setToken(token)
        setCurrentUser(user)
        // Redirect user to the home page
        navigate("/home");
      } catch (error) {
        console.error("Google OAuth login failed:", error);
        // Handle login failure (e.g., display error message to the user)
      }
    },
    onError: (error) => console.error("Google OAuth login failed:", error),
  });

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
            <input type={"text"} placeholder="abc123@gmail.com"></input>
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
