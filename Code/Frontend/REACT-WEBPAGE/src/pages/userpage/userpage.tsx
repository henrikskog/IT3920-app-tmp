import React/* , { useEffect, useState } */ from "react";

export const Component = UserPage;

export function UserPage() {
  const username = "Kari Nordmann"

  return (
    <>
      <div>
        <h1>{username}</h1>
        <p>Hei dette er profilen til {username}</p>
      </div>
    </>
  );
}
