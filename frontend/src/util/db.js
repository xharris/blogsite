import axios from "axios";

const inst = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const Blog = {
  add: data => inst.post("/blog/add", data),
  update: data => inst.put(`/blog/${data._id}/update`, data),
  delete: id => inst.post(`/blog/${id}/delete`, { deleted: true }),
  get: id => inst.get(`/blog${id ? "/" + id : "s"}`),
  follow: (blog_id, user_id, token) =>
    inst.put(`/follow/blog/${blog_id}/user/${user_id}`, { token }),
  unfollow: (blog_id, user_id, token) =>
    inst.delete(`/unfollow/blog/${blog_id}/user/${user_id}`, { token }),
};

export const Post = {
  add: async (blog_id, data) => {
    data.blog_id = blog_id;
    return await inst.put(`/blog/${blog_id}/post/add`, data);
  },
  update: data => inst.put(`/blog/post/${data._id}/update`, data),
  get_by_blog_id: blog_id =>
    inst.get(`/blog/${blog_id}/posts`).then(e =>
      [].concat(e.data.data).map(data => ({
        ...data,
        tags: data.tags.filter(t => t != null),
      }))
    ),
  // get
  delete: post_id => inst.delete(`/blog/post/${post_id}/delete`),
};

export const Tag = {
  add: data => inst.post(`/tag/add`, data),
  get: id => inst.get(`/tag${id ? "/" + id : "s"}`),
};

export const Media = {
  add: data => inst.post(`/media/add`, data),
  get: id => inst.get(`/media/${id}`),
  update: data => inst.put(`/media/${data._id}/update`, data),
};

export const Style = {
  get_by_blog_id: blog_id => inst.get(`/style/blog/${blog_id}`),
  get_by_post_id: post_id => inst.get(`/style/post/${post_id}`),
};

export const User = {
  login: (username, password) =>
    inst.post(`/user/login`, { username, password }),
  checkAuth: token => inst.post(`/user/checkAuth`, { token }),
  following: (user_id, _type, other_id) =>
    inst.get(`/following/${_type}/${other_id}/user/${user_id}`),
};

const api = {
  Blog,
  Post,
  Tag,
  User,
  Media,
  Style,
};

export default api;
