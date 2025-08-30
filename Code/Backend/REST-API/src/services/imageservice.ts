import pool from "../mysql-pool.js";
import type { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";
import { Image } from "../types.js";

class ImageService {
  async get(image_id: number) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT image, type FROM images WHERE id = ?",
      [image_id]
    );

    return results as Image[];
  }

  async create(image: Image) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "INSERT INTO images (image, type) VALUES (?, ?)",
      [image.image, image.type]
    );

    console.log(`Create image with id: ${results.insertId} successfuly`);
    return results.insertId;
  }

  async update(image_id: number, image: Image) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "UPDATE images SET image = ?, type = ? WHERE id = ?",
      [image.image, image.type, image_id]
    );

    if (results.affectedRows == 0) throw new Error("No row updated");

    console.log(`Create image with id: ${results.insertId} successfuly`);
    return ;
  }
}

export const imageService = new ImageService();
