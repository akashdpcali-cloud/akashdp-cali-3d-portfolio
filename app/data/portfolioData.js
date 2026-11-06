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

    database: ["PostgreSQL, SQLite"],
  },

  projects: {
    "fullstack AI chat web Application": [
      "react.js",
      "postgreSQL",
      "node.js",
      "express.js",
      "groq api",
      "pollinations.ai",
    ],
    "fullstack Message/chat Web application": [
      "react.js",
      "postgreSQL",
      "node.js",
      "express.js",
      "socket.io",
    ],
    "3d portfolio": [
      "next.js",
      "three.js",
      "gsap",
      "groq api",
      "resend for mail",
    ],

    mini_projects: [
      "fullstack image to 3d wed app",
      "fullstack ecommerce website",
      "fullstack to do list web app",
    ],
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
  "Character Movement: keys(W A S D ) or the virtual joystick.",
  "360° View: Left click + Drag to look around",
  "Please refer to the map for optimal navigation.",
  "Switch to your preferred character",
  "Explore and Interact with the environment to discover my craft",
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
    "React.js", // repeat
    "Three.js",
    "GSAP",
    "Blender",
    "Node.js",
    "Express.js",
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
      "This is where my 3D journey began. I built this portfolio while learning Blender and Three.js from Andrew Woan’s YouTube tutorials, using Three.js, vanilla JavaScript, HTML, CSS, GSAP, and Blender. Looking back, it shows just how far I’ve come.",
    link: "https://akashdp.vercel.app/",
  },
  {
    board: "me_board",
    title: "resume",
    content:
      "I’m an engineering student and a 3D full-stack developer, currently working as a frontend intern at Code Nimbus Solutions, a product-based company that helps businesses build and scale their digital presence. As an intern, I build wedding templates. I’m always open to collaborating on interesting projects, and I’d love to explore new ideas and build meaningful connections along the way.",
    link: "https://drive.google.com/file/d/1wyel5YMMUk9YlNOpfzuJHQ3f7UAjRWoY/view?usp=sharing",
  },
  {
    board: "conor_board",
    title: "Inspiration",
    content:
      "Conor McGregor has inspired me more than anyone else in MMA, a sport that has been a big part of my life. Watching his confidence, discipline, and self-belief changed how I see myself. He taught me to back myself, to stay composed under pressure, and to carry myself with conviction. He once spoke about Vincent Van Gogh: “He dedicated his life to his art and lost his mind in the process. That’s happened to me.” That level of dedication is what I aspire to. I don’t apply these lessons only to my physical training. I bring the same mindset to my studies, my work, and my goals, and I use it to keep growing in every part of my life.",
    link: null,
  },
];

// ABOUT ME POPUP DATA

export const AboutmePopupSocial = {
  summary:
    "I’m a 3D full-stack developer who loves building things that blend creativity with technology. Outside of code, MMA is my passion, with wrestling at the heart of it. The discipline and resilience it demands shape how I approach everything. I want to invest more time exploring what I’m capable of, immerse myself in the deep waters of my craft, and redefine what’s possible.",
  linkedin: "https://www.linkedin.com/in/akashdpcali/",
  github: "https://github.com/akashdpcali-cloud",
  gmail: "akashdpcali@gmail.com",
};
