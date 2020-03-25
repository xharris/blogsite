import axios from "axios";

const users = () => [
  {
    id: "1",
    full_name: "Bob Dillington",
    img_url: "https://avatarfiles.alphacoders.com/146/146703.png"
  }
];

const inst = axios.create({
  baseURL: "http://localhost:3000/api"
});

export const Tutorial = {
  add: data => inst.post("/tutorials/add", data),
  update: (id, data) => inst.put(`/tutorials/${id}/update`, data),
  delete: id => inst.delete(`/tutorials/${id}/delete`),
  get: id => inst.get(`/tutorials${id ? "/" + id : ""}`)
};

export const TutorialPart = {
  add: (tutorial_id, data) => {
    data.tutorial_id = tutorial_id;
    inst.post(`/tutorial/${tutorial_id}/part/add`, data);
  },
  get_by_tutorial_id: tutorial_id => inst.get(`/tutorial/${tutorial_id}/parts`),
  delete: part_id => inst.delete(`/tutorial/part/${part_id}/delete/$`)
};

export const Tag = {
  get: id => inst.get(`/tags${id ? "/" + id : ""}`)
};

export const User = {};

const api = {
  Tutorial,
  TutorialPart,
  Tag,
  User
};

export default api;
