import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./navbar";
import { UserContext } from "../../context";
import { loginService } from "../../services/loginService";

export const Component = Root;

export function Root() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    loginService
      .isLoggedIn()
      .then((username) => setUsername(username))
      .catch((err) => {
        setUsername("");
        console.error(err);
      });
  }, [username]);
  console.log(username);
  return (
    <>
      <UserContext.Provider value={{ name: username, setName: setUsername }}>
        <NavBar />
        {/* All pages are loaded in Outlet */}
        <div style={{ marginTop: "75px" }}>
          <Outlet />
        </div>
      </UserContext.Provider>
    </>
  );
}
