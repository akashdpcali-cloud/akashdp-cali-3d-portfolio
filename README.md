# Akash D P — 3D Full-Stack Developer

> **A portfolio built as a world to explore.** Meet the work, tools, and ideas behind creative web development in an interactive 3D experience.

This project is Akash D P's interactive developer portfolio. Visitors can explore a low-poly environment, switch characters, drive a truck, and open project, profile, map, feedback, and AI-assistant panels.

## Highlights

- **Explore freely:** Navigate the 3D world with a keyboard or touch joystick.
- **See projects in context:** Interact with scene objects to discover project details and links.
- **Make it your own:** Choose a character, inspect the map, and adjust the camera.
- **Ask and connect:** Use the AI assistant and feedback form when their server credentials are configured.
- **Designed for the browser:** Built with Next.js, React, Three.js, and GSAP.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build, run:

```bash
npm run build
npm start
```

## Optional server features

Add these variables to the existing `.env.local` file to enable the AI chat and email feedback API:

| Variable | Used by | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | `/api/chat` | Authenticates AI chat requests. |
| `RESEND_API_KEY` | `/api/feedback` | Authenticates feedback email delivery. |
| `FEEDBACK_EMAIL` | `/api/feedback` | Destination address for submitted feedback. |

Keep credentials server-side; do not prefix them with `NEXT_PUBLIC_`. The portfolio and 3D scene can be explored without configuring these optional services.

## Controls

| Action | Control |
| --- | --- |
| Move | `W`, `A`, `S`, `D`, arrow keys, or the on-screen joystick |
| Run | Hold `Shift` or use the run button |
| Look around | Drag on the 3D scene |
| Enter or exit the truck | Click near the truck or press `F` when nearby |
| Explore a destination | Open the map and select a location |

## Project structure

- `app/page.js` — portfolio shell, state, and interactive panels.
- `app/components/ThreeScene/` — Three.js world, character movement, and interactions.
- `app/components/LoadingPage/` — animated loading experience.
- `app/data/portfolioData.js` — portfolio content, characters, and scene labels.
- `app/api/` — AI chat and feedback endpoints.
- `public/models/`, `public/audio/`, and `public/assets/` — 3D models and media.

## Performance notes

The 3D scene is code-split, and the AI chat bundle loads the first time it is opened. Rendering uses a capped pixel ratio, a smaller shadow map, and skips outline post-processing when no object is highlighted. Both render loops pause while the tab is hidden and resume with a bounded frame delta.

## npm scripts

- `npm run dev` — start the development server.
- `npm run lint` — check the project with ESLint.
- `npm run build` — create a production build.
- `npm start` — serve the production build.
