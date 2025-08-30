import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

export function RecipeStepWidget({
  recipe,
  recReq,
}: {
  recipe: string[];
  recReq?: {
    add: (RecReq: string) => void;
    changed: (RecReq: string, index: number) => void;
    delete: (index: number) => void;
  };
}) {
  const [recipeStep, setRecipeStep] = useState("");
  return (
    <>
      {recipe.length && (
        <ol>
          {recipe.map((r, i) => (
            <li
              key={i}
              data-testid={`recipe step ${i + 1}`}
              title={`Step ${i + 1}`}
            >
              {recReq ? (
                <>
                  <TextField
                    placeholder="write the step here"
                    style={{ marginBottom: "10px" }}
                    value={r}
                    onChange={(e) => recReq.changed(e.currentTarget.value, i)}
                    data-testid={`recipe step textarea ${i + 1}`}
                  />
                  <Button
                    style={{
                      marginLeft: "10px",
                      marginRight: "10px",
                      marginBottom: "30px",
                      minWidth: "initial",
                      width: "20px",
                      minHeight: "initial",
                      height: "30px",
                    }}
                    color="error"
                    variant="contained"
                    data-testid={`recipe step button delete ${i + 1}`}
                    onClick={() => recReq.delete(i)}
                  >
                    X
                  </Button>
                </>
              ) : (
                r
              )}
            </li>
          ))}
        </ol>
      )}
      {recReq && (
        <>
          <div>
            <TextField
              placeholder="write the step here"
              style={{ marginBottom: "10px" }}
              onChange={(e) => setRecipeStep(e.currentTarget.value)}
              value={recipeStep}
              data-testid={`recipe step textarea add`}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            data-testid={`recipe step button add`}
            onClick={() => {
              recReq.add(recipeStep);
              setRecipeStep("");
            }}
          >
            Add Step
          </Button>
        </>
      )}
    </>
  );
}
