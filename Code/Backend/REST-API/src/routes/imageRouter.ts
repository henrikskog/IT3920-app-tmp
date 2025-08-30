import express from "express";
import { imageService } from "../services/imageservice.js";
import { imageHandling, isAuthenticated } from "../middleware.js";
import { Image } from "../types.js";

const router = express.Router();

router.route("/").post(isAuthenticated, imageHandling, async (req, res) => {
  console.log(`Image, POST: ${req.url}`);
  try {
    const image: Image = {
      type: req.file?.mimetype as string,
      image: req.file?.buffer as Buffer,
    };
    const image_id = await imageService.create(image);
    res.status(201).json({ id: image_id });
  } catch (error) {
    console.error(error);
    res.status(500).send("A server error!");
  }
});

router
  .route("/:image_id")
  .get((req, res) => {
    console.log(`Image, GET: ${req.url}`);

    const image_id = Number(req.params.image_id);

    imageService
      .get(image_id)
      .then((data) => {
        console.log(data);
        if (data.length === 0) return res.status(404).send();
        const blob = new Blob([data[0].image], { type: data[0].type });
        console.log(blob);
        res
          .status(200)
          .setHeader("Content-type", data[0].type)
          .send(data[0].image);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("There is a server error!");
      });
  })
  .patch(isAuthenticated, imageHandling, async (req, res) => {
    console.log(`Image, PATCH: ${req.url}`);
    const image_id = Number(req.params.image_id);
    try {
      const image: Image = {
        type: req.file?.mimetype as string,
        image: req.file?.buffer as Buffer,
      };
      await imageService.update(image_id, image);
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).send("A server error!");
    }
  });

const imageRouter = router;
console.log("Image router created");
export { imageRouter };
