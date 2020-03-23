import React, { useState, useEffect } from "react";

import Header from "@feature/header";
import Body from "@feature/body";

import "@style/create.scss";

const Create = () => {
  return (
    <div className="p-create">
      <Header />
      <Body></Body>
    </div>
  );
};

export default Create;
