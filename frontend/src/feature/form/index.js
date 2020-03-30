import React, { useState, useEffect } from "react";

import DateTimePicker from "react-datetime";
import "react-datetime/css/react-datetime.css";

import Button from "@feature/button";

import "./index.scss";
import { recursiveMap } from "@util";

export const Label = props =>
  props.label ? <label htmlFor={props.name}>{props.label}</label> : null;

export const Input = props => (
  <FormGroup
    key={props.name}
    className={[props.name, props.className || ""].join(" ")}
  >
    <Label key={props.name + "-label"} {...props} />
    <input
      {...props}
      key={props.name + "-input"}
      type={props.type || "text"}
      required={props.required ? true : false}
    />
  </FormGroup>
);

export const TextArea = props => (
  <FormGroup
    key={props.name}
    className={[props.name, props.className || ""].join(" ")}
  >
    <Label key={props.name + "-label"} {...props} />
    <textarea
      key={props.name + "-input"}
      name={props.name}
      required={props.required ? true : false}
      onChange={props.onChange}
      disabled={props.disabled}
    ></textarea>
  </FormGroup>
);

export const Date = props => (
  <FormGroup
    key={props.name}
    className={[props.name, props.className || ""].join(" ")}
  >
    <Label key={props.name + "-label"} {...props} />
    <DateTimePicker
      {...props}
      key={props.name + "-input"}
      _type="Date"
      format="MM/DD/YYYY hh:mm A"
      onChange={e => props.onChange(e, true)}
      inputProps={props}
    />
  </FormGroup>
);

export const Radio = props => {
  const radioID = i => `${props.form}-radio-${props.value || props.name}`;

  return (
    <FormGroup
      key={props.name}
      className={[props.name, props.className || ""].join(" ")}
    >
      <Label key={props.name + "-label"} {...props} />
      <fieldset
        key={props.formsetid}
        id={props.formsetid}
        name={props.name}
        onChange={props.onChange}
      >
        {React.Children.map(props.children, c =>
          React.cloneElement(c, {
            key: radioID(c),
            name: props.name,
            default: props.checked,
            curr_value: props.curr_value,
            ...c.props
          })
        )}
      </fieldset>
    </FormGroup>
  );
};

export const Option = props => {
  const checked = props.curr_value
    ? props.curr_value === props.value
    : props.default === props.value;

  const input = (
    <input
      key={props.key + "-" + props.value}
      name={props.name}
      type="radio"
      value={props.value}
      defaultChecked={checked}
      className={`radio-label ${checked ? "selected" : ""}`}
    />
  );

  return (
    <div key={props.key} className={props.className || ""}>
      {props.label ? (
        <label
          key={props.key + "-" + props.value}
          name={props.name}
          type="radio"
          value={props.value}
          defaultChecked={checked}
          className={`radio-label ${checked ? "selected" : ""}`}
        >
          {[input, props.label]}
        </label>
      ) : (
        input
      )}
    </div>
  );
};

export const Checkbox = props => (
  <FormGroup
    key={props.name}
    className={[props.name, props.className || ""].join(" ")}
  >
    <label className={`check-label ${props.curr_value ? "checked" : ""}`}>
      <input
        type="checkbox"
        name={props.name}
        checked={props.default}
        onChange={e => props.onChange(e.target.checked, true)}
        disabled={props.disabled}
      />
      <span>{props.label}</span>
    </label>
  </FormGroup>
);

export const Submit = props => (
  <FormGroup
    key={props.name}
    className={[props.name || "submit", props.className || ""].join(" ")}
  >
    <Button key={"submit"} type="submit">
      {props.label || "Submit"}
    </Button>
  </FormGroup>
);

export const FormGroup = props => (
  <div className={`form-group ${props.className || ""}`}>{props.children}</div>
);

var id = 0;

const Form = props => {
  const [inputs, setInputs] = useState({});
  const [formID, setFormID] = useState("");

  useEffect(() => {
    setFormID(`form-${id}`);
    id++;
  }, []);

  const onChange = (name, value) => {
    if (props.onChange) props.onChange(name, value);
  };

  const formsetid = i => `${formID}-fieldset-${i.name || i.props.name}`;

  return (
    <form
      id={formID}
      className={`f-form ${props.className || ""}`}
      onSubmit={e => {
        if (props.onSubmit) {
          e.preventDefault();
          var outputs = Object.assign(inputs, {});
          console.log(inputs);
          if (props.inputs)
            props.inputs.forEach(i => {
              if (i.value) outputs[i.name] = i.value;
            });
          props.onSubmit(outputs);
        }
      }}
    >
      {recursiveMap(
        props.children,
        c =>
          React.cloneElement(
            c,
            c.props.name
              ? {
                  form: formID,
                  formsetid: formsetid(c),
                  curr_value: inputs[c.props.name],
                  onChange: (e, direct) => {
                    if (!direct) e.persist();
                    if (c.props.value == null) {
                      onChange(c.props.name, direct ? e : e.target.value);
                      setInputs({
                        ...inputs,
                        [c.props.name]: direct ? e : e.target.value
                      });
                    }
                  }
                }
              : {}
          ),
        "f-form"
      )}
    </form>
  );
};

export default Form;
