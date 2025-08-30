import React, { useContext, useEffect, useState } from "react";
import ratingService from "../services/ratingService";
import { UserContext } from "../context";
import MUIRating from "@mui/material/Rating";
import { Stack, Typography } from "@mui/material";

export function RatingWidget({ recipe_id }: { recipe_id: number }) {
  const [rating, setRating] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [hover, setHover] = useState(-1);
  const user = useContext(UserContext);

  useEffect(() => {
    ratingService
      .getAvg(recipe_id)
      .then((data) => setAvgRating(Number(data.rating)))
      .catch((err) => console.log(err));

    ratingService
      .getUserRating(recipe_id)
      .then((data) => setRating(Number(data.rating)))
      .catch((err) => console.log(err));
  }, [recipe_id, user.name, rating]);

  const labels: { [index: string]: string } = {
    1: "Worst",
    2: "Bad",
    3: "OK",
    4: "Good",
    5: "Best",
  };

  return (
    <Stack direction={"row"} justifyContent={"flex-end"}>
      <Typography variant="h5">
        {typeof avgRating == "number" ? avgRating.toPrecision(2) : 0}
      </Typography>
      <MUIRating
        style={{ marginTop: "5px", marginLeft: "15px" }}
        name="simple-controlled"
        value={rating}
        onChange={async (event, newValue) => {
          try {
            if (newValue == null) {
              await ratingService.remove(recipe_id);
            } else if (rating == null) {
              await ratingService.create(recipe_id, newValue);
            } else if (newValue != rating) {
              await ratingService.update(recipe_id, newValue);
            }

            setRating(newValue);
          } catch (error) {
            console.error(error);
          }
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {rating !== null && (
        <Typography variant="h5" sx={{ minWidth: 70 }}>
          {labels[hover !== -1 ? hover : rating]}
        </Typography>
      )}
    </Stack>
  );
}
