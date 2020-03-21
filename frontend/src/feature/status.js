import color from "@feature/color";

export const status_icon = {
  going: "check_circle",
  owned: "stars",
  cant: "cancel"
};

export const status_color = {
  going: color.green,
  owned: color.yellow,
  maybe: color.yellow2,
  cant: color.green
};

export const status_string = {
  going: "going",
  owned: "your event",
  maybe: "maybe",
  cant: "can't go"
};
