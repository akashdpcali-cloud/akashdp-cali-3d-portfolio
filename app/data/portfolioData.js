import idle from "../../public/models/peter/";

const portfolioData = {
  personal: {
    name: "Akash D P",
    role: "Full-Stack Developer",
    description:
      "Akash D P is a full-stack developer who builds interactive web experiences and modern web applications.",
  },

  skills: {
    frontend: ["HTML", "CSS", "JavaScript", "React.js", "Next.js"],

    "3d": ["Three.js", "GSAP"],

    backend: ["Node.js", "Express.js"],
  },

  portfolio: {
    currentProject: {
      name: "Spider-Verse 3D Portfolio",
      description:
        "An interactive 3D portfolio inspired by Spider-Verse, built as an explorable game-like experience.",
      technologies: [
        "Next.js",
        "React.js",
        "Three.js",
        "GSAP",
        "Octree",
        "Nipple.js",
      ],
    },
  },
};

export default portfolioData;

export const characters = [
  {
    id: 1,
    name: "peter",
    fullname: "Peter Parker",
    image: "https://i.ibb.co/tphGWGWp/0a9dfbf43d242f044d8167302a31d27a.jpg",
    idle: "../../public/models/peter/peter-idle.fbx",
    walk: "../../public/models/peter/peter-walk.fbx",
    run: "../../public/models/peter/peter-run.fbx",
  },
  {
    id: 2,
    name: "gwen",
    fullname: "Gwen Stacy",
    image: "https://i.ibb.co/chqfmRFW/1f2e96a499ab87a84dde3676c856d6b3.jpg",
    idle: "../../public/models/gwen/gwen-idle.fbx",
    walk: "../../public/models/gwen/gwen-walk.fbx",
    run: "../../public/models/gwen/gwen-run.fbx",
  },
];
