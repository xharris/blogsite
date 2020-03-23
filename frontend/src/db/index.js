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

export const TutorialGroup = {
  add: data => inst.post("/tutorialgroup", data),
  update: (id, data) => inst.put(`/tutorialgroups/${id}`, data),
  delete: id => inst.delete(`/tutorialgroups/${id}`),
  get: id => inst.get(id == null ? "/tutorialgroups" : `/tutorialgroup/${id}`)
};

export const Tag = {
  get: id => inst.get(id == null ? "/tags" : `/tag/${id}`)
};

export const User = {};

const api = {
  TutorialGroup,
  Tag,
  User
};

export default api;
