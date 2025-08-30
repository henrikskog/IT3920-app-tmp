import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const Component = HomePage;

const BoxButton = styled(Box)(({ theme }) => ({
  width: 300,
  height: 100,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "2rem",
  margin: "25px",
  cursor: "pointer",
  boxShadow: "4px 2px 2px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease",
  backgroundColor: theme.palette.info.main,
  "&:hover": {
    backgroundColor: theme.palette.info.dark,
  },
}));

export function HomePage() {
  const navigate = useNavigate();
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    navigateTo: string
  ) => {
    // Needs typescript something
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Prevent default behavior, like scrolling
      navigate(navigateTo);
    }
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="/homepage-photo.jpg"
          alt="Homepage Photo"
          style={{
            display: "block",
            marginTop: "15px",
            marginBottom: "15px",
            borderRadius: "25px",
            width: "75%",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BoxButton
            data-testid={`Home button Favorite`}
            onClick={() => navigate("/favorites")}
            onKeyDown={(event) => handleKeyDown(event, "/favorites")}
            tabIndex={0}
          >
            Favorite Recipes
          </BoxButton>
          <BoxButton
            data-testid={`Home button Random`}
            onClick={() => navigate("/recipes/2")}
            onKeyDown={(event) => handleKeyDown(event, "/recipes/2")}
            tabIndex={0}
          >
            Random Recipe
          </BoxButton>
          <BoxButton
            data-testid={`Home button Fridge`}
            onClick={() => navigate("/fridge")}
            onKeyDown={(event) => handleKeyDown(event, "/fridge")}
            tabIndex={0}
          >
            My fridge
          </BoxButton>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BoxButton
            data-testid={`Home button Recipes`}
            onClick={() => navigate("/recipes")}
            onKeyDown={(event) => handleKeyDown(event, "/recipes")}
            tabIndex={0}
          >
            Recipes
          </BoxButton>
          <BoxButton
            data-testid={`Home button Shopping List`}
            onClick={() => navigate("/shoppinglist")}
            onKeyDown={(event) => handleKeyDown(event, "/shoppinglist")}
            tabIndex={0}
          >
            Shopping List
          </BoxButton>
          <BoxButton
            data-testid={`Home button What`}
            onClick={() => navigate("/profile")}
            onKeyDown={(event) => handleKeyDown(event, "/profile")}
            tabIndex={0}
          >
            My profile
          </BoxButton>
        </div>
      </div>
    </>
  );
}
