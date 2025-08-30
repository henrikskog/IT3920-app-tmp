import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/icons-material/Menu";
import HomeIcon from '@mui/icons-material/Home';
import { UserContext } from "../../context";

export const Component = NavBar;

export function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar>
          <Toolbar>
            <div>
              <IconButton
                data-testid={"navbar icon hamburger"}
                size="large"
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(!drawerOpen)}
                aria-label="drawer-button"
              >
                <Menu />
              </IconButton>
              <IconButton
                color="inherit"
                data-testid={"navbar button Home"}
                onClick={() => {
                  navigate("/");
                }}
              >
                <HomeIcon />
                HOME
              </IconButton>
              <Drawer
                data-testid={"navbar button Drawer"}
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(!drawerOpen)}
              >
                <List
                  style={{
                    paddingLeft: "25px",
                    paddingRight: "25px",
                    paddingTop: "25px",
                    fontSize: "16px",
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      navigate("/");
                      setDrawerOpen(false);
                    }}
                    data-testid={"navbar hamburger Home"}
                  >
                    Home
                  </ListItemButton>

                  {user.name ? (
                    <ListItemButton
                      onClick={() => {
                        navigate("/profile");
                        setDrawerOpen(false);
                      }}
                      data-testid={"navbar hamburger Profile"}
                    >
                      Your Profile
                    </ListItemButton>
                  ) : (
                    <ListItemButton
                      onClick={() => {
                        navigate("/login");
                        setDrawerOpen(false);
                      }}
                      data-testid={"navbar hamburger Login"}
                    >
                      Login
                    </ListItemButton>
                  )}

                  <ListItemButton
                    onClick={() => {
                      navigate(`/fridge`);
                      setDrawerOpen(false);
                    }}
                    data-testid={"navbar hamburger Fridge"}
                  >
                    Fridge
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      navigate(`/shoppinglist`);
                      setDrawerOpen(false);
                    }}
                    data-testid={"navbar hamburger Shopping List"}
                  >
                    Shopping List
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      navigate("/favorites");
                      setDrawerOpen(false);
                    }}
                    data-testid={"navbar hamburger Favorites"}
                  >
                    Favorites
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      navigate("/recipes");
                      setDrawerOpen(false);
                    }}
                    data-testid={"navbar hamburger Recipes"}
                  >
                    Recipes
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      navigate("/recipes/2");
                      setDrawerOpen(false);
                    }}
                    data-testid={"navbar hamburger Random recipe"}
                  >
                    Random recipe
                  </ListItemButton>

                  {/* <ListItemButton
                    onClick={() => {
                      navigate("/calorietracker");
                      setDrawerOpen(false);
                    }}
                  >
                    Calorie tracker
                  </ListItemButton> */}
                </List>
              </Drawer>
            </div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {/* Something to keep the button away from the hamburger */}
            </Typography>
            {user.name ? (
              <Button
                color="inherit"
                data-testid={"navbar button Profile"}
                onClick={() => {
                  navigate("/profile");
                }}
              >
                Profile
              </Button>
            ) : (
              <Button
                color="inherit"
                data-testid={"navbar button Login"}
                onClick={() => {
                  navigate("/login");
                }}
                aria-label="toolbar-login"
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
