import axios from "axios";
import { ImageFile } from "../types";

async function create(image: ImageFile) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await axios.post<{ id: number }>(`/images`, formData, {
    data: image,
  });

  return response.data.id;
}

async function get(image_id: number) {
  const response = await axios.get<Blob>(`/images/${image_id}`, {
    responseType: "blob",
  });

  return response.data;
}

async function update(image_id: number, image: ImageFile) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await axios.patch(`/images/${image_id}`, formData);

  return response.data;
}

const imageService = {
  get,
  create,
  update,
};

export default imageService;
