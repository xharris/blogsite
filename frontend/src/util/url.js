const paths = {
  // TUTORIALS
  browse_tutorials: () => "/tutorials",
  view_tutorial: (id, action) =>
    `/tutorials/${id}${action ? `/${action}` : ""}`,
  // SOFTWARE
  browse_software: () => "/software",
  // BLOG
  browse_blogs: () => "/expore",
  view_blog: (id, action) => `/blog/${id}${action ? `/${action}` : ""}`,
  browse_followed_blogs: () => "/",
  // POST
  view_post: (id, action) => `/post/${id}${action ? `/${action}` : ""}`
};

export default paths;
