import axios from "axios";

const inst = axios.create({
  baseURL: "http://localhost:3000/api"
});

export const Tutorial = {
  add: data => inst.post("/tutorials/add", data),
  update: data => inst.put(`/tutorials/${data._id}/update`, data),
  delete: id => inst.post(`/tutorials/${id}/delete`, { deleted: true }),
  get: id =>
    inst.get(`/tutorials${id ? "/" + id : ""}`).then(e => {
      return [].concat(e.data.data).map(data => ({
        ...data,
        tags: data.tags.filter(t => t != null)
      }));
    })
};

export const TutorialPart = {
  add: (tutorial_id, data) => {
    data.tutorial_id = tutorial_id;
    inst.post(`/tutorial/${tutorial_id}/part/add`, data);
  },
  update: data => inst.put(`/tutorial/part/${data._id}/update`, data),
  get_by_tutorial_id: tutorial_id => inst.get(`/tutorial/${tutorial_id}/parts`),
  delete: part_id => inst.delete(`/tutorial/part/${part_id}/delete`)
};

export const Tag = {
  add: data => inst.post(`/tags/add`, data),
  get: id => inst.get(`/tags${id ? "/" + id : ""}`)
};

export const Media = {
  add: data => inst.post(`/media/add`, data),
  get: id => inst.get(`/media/${id}`),
  update: data => inst.put(`/media/${data._id}/update`, data)
};

export const User = {};

const api = {
  Tutorial,
  TutorialPart,
  Tag,
  User,
  Media
};

export default api;
