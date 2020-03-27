const paths = {
  // TUTORIALS
  browse_tutorials: () => "/tutorials",
  view_tutorial: (id, action) =>
    `/tutorials/${id}${action ? `/${action}` : ""}`,
  // SOFTWARE
  browse_software: () => "/software"
};

export default paths;
