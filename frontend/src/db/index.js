import axios from "axios";

const users = () => [
  {
    id: "1",
    full_name: "Bob Dillington",
    img_url: "https://avatarfiles.alphacoders.com/146/146703.png"
  }
];

const tutorial_parts = () => [
  {
    tutorial_id: "1",
    title: "Creating the ship",
    user_created: "1",
    media: [
      ["image", "https://thumbs.gfycat.com/CrispWelllitBrocketdeer-small.gif"],
      ["video", "https://www.youtube.com/watch?v=f0GYxSmw328"]
    ],
    code: `
      Entity("ship",{
        image = 'ship.png',
        align = 'center'
      })
    `,
    description: `
      Set the ship's image and center it
    `
  },
  {
    tutorial_id: "1",
    title: "Ship movement",
    user_created: "1",
    media: [
      ["image", "https://thumbs.gfycat.com/CrispWelllitBrocketdeer-small.gif"],
      ["video", "https://www.youtube.com/watch?v=f0GYxSmw328"]
    ],
    code: `
      Entity("ship",{
        image = 'ship.png',
        align = 'center',
        update = function(self, dt)
          self.angle = self.angle + 5 * dt
        end
      })
    `,
    description: `
      We increment the angle by 5.
      dt is multiplied 
    `
  }
];

const inst = axios.create({
  baseURL: "http://localhost:3000/api"
});

export const Tutorial = {
  add: data => inst.post("/tutorials/add", data),
  update: (id, data) => inst.put(`/tutorials/${id}/update`, data),
  delete: id => inst.delete(`/tutorials/${id}/delete`),
  get: id => inst.get(`/tutorials${id ? "/" + id : ""}`)
};

export const TutorialPart = {
  get_by_tutorial_id: tutorial_id => inst.get(`/tutorial/${tutorial_id}/parts`)
};

export const Tag = {
  get: id => inst.get(`/tags${id ? "/" + id : ""}`)
};

export const User = {};

const api = {
  Tutorial,
  TutorialPart,
  Tag,
  User
};

export default api;
