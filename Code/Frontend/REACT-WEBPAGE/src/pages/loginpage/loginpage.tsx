import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { Button,  Input, Typography } from "@mui/material";
import { loginService } from "../../services/loginService";

export const Component = LoginPage;

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const user = useContext(UserContext);

  useEffect(() => {
    if (user.name) navigate(-1);
  }, [user.name]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1 style={{ fontSize: "4em" }}>Login</h1>
        <label>
          Username:
          <Input
            style={{ marginLeft: "5px" }}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <Input
            style={{ marginLeft: "5px" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </label>
        <br />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={() => {
            loginService
              .login({ username: username, password: password })
              .then(() => {
                user.setName(username);
                navigate(-1);
              })
              .catch((err) => console.log(err));
          }}
        >
          Login
        </Button>

        <Typography margin={1}>Or</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/createuser");
          }}
        >
          Sign up
        </Button>
      </div>
    </>
  );
}
