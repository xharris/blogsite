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
  view_post: (id, action) => `/post/${id}${action ? `/${action}` : ""}`,
  edit_post: post_id => `/post/${post_id}/edit`,
  new_post: blog_id => `/blog/${blog_id}/newpost`
};

export default paths;
