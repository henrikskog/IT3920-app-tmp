import { Button, FormControl, Stack, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";

export const Component = CreateUserPage;

export function CreateUserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <Stack spacing={2} maxWidth={300}>
      <Typography>Create a user!</Typography>
      <FormControl>
        <TextField
          id="outlined-username-input"
          label="Username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </FormControl>
      <FormControl>
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </FormControl>

      <Button
        variant="contained"
        onClick={async () => {
          try {
            await userService.create({
              name: username,
              password: password,
              image_id: 1,
            });
            navigate("/login");
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Create User
      </Button>
    </Stack>
  );
}
