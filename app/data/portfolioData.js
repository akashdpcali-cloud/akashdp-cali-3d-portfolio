import { exp } from "three/tsl";

// CHATBOT CONTETN
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

// CHARACTERS
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

//BGM
export const portfolioBGM = [
  "/audio/bgm1.mp3",
  "/audio/bgm2.mp3",
  "/audio/bgm3.mp3",
  "/audio/bgm4.mp3",
];

//INSTRUCTIONS
export const instructionPopupData = [
  "Welcome to my interactive 3D portfolio, inspired by the visual world of Spider-Verse.",
  "Character Movement: keys(W A S D ) or the virtual joystick.",
  "360° View: Click + Drag on screen to look around",
  "Explore the world to discover my projects, skills, experience, and other work.",
];

//PROPS

export const Props = {
  sheep: [
    "React.js",
    "Three.js",
    "GSAP",
    "Blender",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Prisma ORM",
    "Socket.io",
    "Monorepo",
    "Next.js",
  ],
  cow: [
    "HTML",
    "CSS",
    "Js",
    "SQLite",
    "Vite",
    "MUUUUU",
    "MUUUUU",
    "MUUUUU",
    "MUUUUU",
    "MUUUUU",
    "MUUUUU",
  ],
  truck: "Click to Drive",
  knight:
    "Tell the mountains to move, or I will cut through them. Arrows can darken the sky, and the enemy can charge, but as long as the war drums keep beating, the army keeps moving forward. And you are no different. They can block your road, steal your time, bury your name, but not your heart. So march forward, because as long as that drum in your chest keeps beating, no mountain on earth can stand in your way.",
  mcgregor: "shut your mouth mate",
};

// BOARD POPUP DATA
export const BoardPopupData = [
  {
    board: "old_board",
    title: "Old Me",
    content:
      "this is my old portrolio built using html, css, js, 3js and gsap as a learning process",
    link: "https://amazon.com",
  },
  {
    board: "me_board",
    title: "resume",
    content:
      "this is my old portrolio built using html, css, js, 3js and gsap as a learning process",
    link: "https://amazon.com",
  },
  {
    board: "conor_board",
    title: "Inspiration",
    content:
      "this is my old portrolio built using html, css, js, 3js and gsap as a learning process",
    link: null,
  },
];

// ABOUT ME POPUP DATA

export const AboutmePopupSummary =
  "hello this is akash dp i am a 3d fullstack developer";
