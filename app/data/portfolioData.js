const portfolioData = {
  personal: {
    name: "Akash D P",
    role: "Full-Stack Developer",
    description:
      "Akash D P is a full-stack developer who builds interactive web experiences and modern web applications.",
  },

  skills: {
    frontend: ["React.js", "Next.js"],

    "3d": ["Three.js", "Blender"],

    animation: ["GSAP"],

    backend: ["Node.js", "Express.js"],

    "web socket": ["socket.io"],

    database: ["PostgreSQL, SQLite"],
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
    idle: "/models/peter/peter-idle.fbx",
    walk: "/models/peter/peter-walk.fbx",
    run: "/models/peter/peter-run.fbx",
  },
  {
    id: 2,
    name: "gwen",
    fullname: "Gwen Stacy",
    image: "https://i.ibb.co/chqfmRFW/1f2e96a499ab87a84dde3676c856d6b3.jpg",
    idle: "/models/gwen/gwen-idle.fbx",
    walk: "/models/gwen/gwen-walk.fbx",
    run: "/models/gwen/gwen-run.fbx",
  },
];

export const portfolioBGM = [
  "/audio/bgm1.mp3",
  "/audio/bgm2.mp3",
  "/audio/bgm3.mp3",
  "/audio/bgm4.mp3",
];

export const instructionPopupData = [
  "Welcome to my interactive 3D portfolio, inspired by the visual world of Spider-Verse.",
  "Use W, A, S, and D to navigate your character through the environment.",
  "Explore the world to discover my projects, skills, experience, and other work.",
];
