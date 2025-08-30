import React/* , { useEffect, useState } */ from "react";

export const Component = ProfilePage

export function ProfilePage() {
  const username = "Ola Nordmann"

  return (
    <>
      <div>
        <h1>{username}</h1>
        <p>Hei dette er profilen til {username}</p>
      </div>
    </>
  );
}
