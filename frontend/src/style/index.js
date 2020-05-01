const tablet_width = 768;
const desktop_width = 1024;

export const mixins = {
  get phone() {
    return `@media (max-width: ${tablet_width - 1}px)`;
  },
  get tablet() {
    return `@media (min-width: ${tablet_width}px) and (max-width: ${desktop_width -
      1}px)`;
  },
  get desktop() {
    return `@media (min-width: ${desktop_width}px)`;
  }
};

export const scrollbar = color => `
* {
  scrollbar-color: ${color} rgba(224, 224, 224, 0.1) !important;
}

*::-webkit-scrollbar-thumb {
  background-color: ${color} !important;
}
`;
