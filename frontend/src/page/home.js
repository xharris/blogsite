import React, { useState, useLayoutEffect } from "react";

import { useAuthContext } from "@util/authContext";
import { Blog } from "@util/db";
import paths from "@util/url";

import Header from "@feature/header";
import Body from "@feature/body";

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const { user, showLoginModal } = useAuthContext();

  useLayoutEffect(() => {
    if (user)
      Blog.get().then(e => {
        setBlogs(e.data.data);
      });
  }, [user]);

  return (
    <div className="p-home">
      <Header />
      <Body>
        {user ? (
          blogs &&
          blogs.map(b => (
            <a key={b._id} href={paths.view_blog(b._id)}>
              {b.title}
            </a>
          ))
        ) : (
          <div className="welcome">
            Welcome to the blogging emporium!! log in or sign up now!
          </div>
        )}
      </Body>
    </div>
  );
};

export default Home;
