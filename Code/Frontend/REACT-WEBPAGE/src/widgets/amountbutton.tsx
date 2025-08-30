import { Button, ButtonGroup } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export function PlussMinusButton({
  ingredient,
  amount,
  onClickPluss,
  onClickMinus,
}: {
  ingredient: string;
  amount: number;
  onClickPluss: () => void;
  onClickMinus: () => void;
}) {
  return (
    <ButtonGroup orientation="vertical">
      <Button
        aria-label="pluss"
        data-testid={`${ingredient} button +`}
        onClick={onClickPluss}
      >
        <AddIcon />
      </Button>
      <Button
        aria-label="minus"
        disabled={amount == 0}
        data-testid={`${ingredient} button -`}
        onClick={onClickMinus}
      >
        <RemoveIcon />
      </Button>
    </ButtonGroup>
  );
}
