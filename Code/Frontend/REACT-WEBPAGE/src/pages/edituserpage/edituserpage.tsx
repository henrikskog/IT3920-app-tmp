import {
  Button,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import imageService from "../../services/imageservice";
import { ImageFile } from "../../types";

export const Component = CreateUserPage;

export function CreateUserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<ImageFile>();
  const [imageURL, setImageURL] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <Grid spacing={2}>
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
        <FormControl>
          <img
            src={imageURL}
            alt="The uploaded image from input"
            height={400}
            width={300}
          />
          <Button variant="contained" component="label">
            Upload Image
            <input
              id="outlined-image-input"
              type="file"
              onChange={(event) => {
                if (event.target.files?.length == 1) {
                  URL.revokeObjectURL(imageURL);
                  const blob = event.target.files[0];
                  setImageURL(URL.createObjectURL(blob));
                  setImage(blob);
                }
              }}
              required
              hidden
            />
          </Button>
        </FormControl>

        <Button
          variant="contained"
          onClick={async () => {
            try {
              let image_id = 0;
              if (image) {
                image_id = await imageService.create(image);
              }
              await userService.create({
                name: username,
                password: password,
                image_id: image_id,
              });
              navigate("/login");
            } catch (err) {
              console.error(err);
            }
          }}
        >
          Edit User
        </Button>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Grid>
    </>
  );
}
