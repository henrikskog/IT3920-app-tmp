import { Request, Response, NextFunction } from "express";
import multer from "multer";
/**
 *
 * @description A function checking if the user has authenticated to the server yet. Should be put as a middleware before routes needing to be authenticated
 *
 */
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.username) next();
  else res.status(401).send("Error 401 Unauthorized");
}

export const imageHandling = multer().single("image");
