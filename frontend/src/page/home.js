import React, { useState, useEffect } from "react";

import { Blog } from "@util/db";
import paths from "@util/url";

import Header from "@feature/header";
import Body from "@feature/body";

const Home = () => {
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    (async () => {
      await Blog.get().then(e => {
        setBlogs(e.data.data);
      });
    })();
  }, []);

  return (
    <div className="p-home">
      <Header />
      <Body>
        {blogs &&
          blogs.map(b => (
            <a key={b._id} href={paths.view_blog(b._id)}>
              {b.title}
            </a>
          ))}
      </Body>
    </div>
  );
};

export default Home;
