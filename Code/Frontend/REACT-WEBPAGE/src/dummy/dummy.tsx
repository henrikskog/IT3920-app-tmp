import React, { useEffect, useState } from "react";

export function Test({ input }: { input?: number }) {
  const [blue, setBlue] = useState(0)

  useEffect(() => {
    if (input) {
      setBlue(input)
    }
  }, [input]);

  return (
    <>
      <h1>Hello World! {blue}</h1>
      <button
        onClick={() => {
          setBlue(blue - 1)
        }}
      >
        Press Me!
      </button>
    </>
  );
}
