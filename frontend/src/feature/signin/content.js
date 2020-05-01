import React, { useState } from "react";

import { User } from "@util/db";

import Form, { Input, Submit } from "@feature/form";

import "./content.scss";

const SignInContent = props => {
  const [error, setError] = useState(null);

  const onSignUpSubmit = e => {};
  const onLoginSubmit = e => {
    (async () => {
      await User.login(e.email, e.password)
        .then(e => {
          if (props.onSignIn) props.onSignIn(e.data);
        })
        .catch(e => {
          setError("Login failed. Check the email or password.");
        });
    })();
  };

  return props.showSignUp ? (
    <Form onSubmit={onSignUpSubmit} className="form-signup">
      <Input label="Email:" type="email" name="email" required="true" />
      <Input
        label="Display Name:"
        type="text"
        name="display_name"
        required="true"
      />
      <Input
        label="Phone Number:"
        type="tel"
        name="phone"
        pattern={`\\(?[0-9]{3}\\)?[\\-\\s]?[0-9]{3}[\\-\\s]?[0-9]{4}`}
      />
      <Input
        label="Password:"
        type="password"
        name="password"
        required="true"
      />
      <Input
        label="Retype your password:"
        type="password"
        name="password2"
        required="true"
      />
      <Submit />
      {error && <div className="error">{error}</div>}
    </Form>
  ) : (
    <Form onSubmit={onLoginSubmit} className="form-login">
      <Input label="Email:" type="email" name="email" required="true" />
      <Input
        label="Password:"
        type="password"
        name="password"
        required="true"
      />
      <Submit />
      {error && <div className="error">{error}</div>}
    </Form>
  );
};

export default SignInContent;
