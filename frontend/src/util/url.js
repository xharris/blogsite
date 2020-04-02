const paths = {
  // TUTORIALS
  browse_tutorials: () => "/tutorials",
  view_tutorial: (id, action) =>
    `/tutorials/${id}${action ? `/${action}` : ""}`,
  // SOFTWARE
  browse_software: () => "/software",
  // BLOG
  browse_blogs: () => "/explore",
  view_blog: (id, action) => `/blog/${id}${action ? `/${action}` : ""}`,
  browse_followed_blogs: () => "/",
  // POST
  view_post: (blog_id, post_id, action) =>
    `/blog/${blog_id}/post/${post_id}${action ? `/${action}` : ""}`,
  // PROFILE
  view_profile: user_id => `/profile${user_id ? `/${user_id}` : ""}`
};

export default paths;
