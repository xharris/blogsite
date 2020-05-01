import { createContext, useContext, useEffect } from "react";

var style = {
  color: {
    primary: "",
    secondary: ""
  },
  size: {
    content_container_width: "initial"
  },
  bg_effect: "none"
};
/*
const styleContext = data => {
  const [style, setStyle] = useState({color: {
    primary: "",
    secondary: "",
  },
  size: {
    content_container_width: "initial"
  },
  bg_effect: "none"
});

  createContext({ setStyle: new_style => { setStyle(new_style) }, style:style })

  return [
    setStyle,
    ,
    () => useContext(styleContext)
  ];
}
export const useStyleContext = () => useContext(styleContext);

export default styleContext;
*/
