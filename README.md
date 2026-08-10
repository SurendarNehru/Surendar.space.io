# Cosmic Canvas

Prompt 1: The Global Layout & Floating Starfield Component

System Prompt for Code Generation: "Write a complete React/Next.js (or SvelteKit) component for a global layout containing an interactive background starfield canvas. The background must be pure black #000000 or an incredibly dark space midnight hue #050508. Inside the <canvas>, use optimized requestAnimationFrame loops to generate 200–300 tiny white light particles acting as stars. The particles must slowly float upward along the Y-axis to give a continuous, elegant deep-space ambient motion effect. If a particle exits the top of the screen, re-spawn it at the bottom. The canvas must be fixed to the viewport background (z-index: -10) and responsively resize to fill the screen window perfectly without causing lag or screen tearing."

Prompt 2: The Glassmorphic Header Navigation & Micro-Interactions

System Prompt for Code Generation: "Create a sleek, fixed top navigation bar component using Tailwind CSS. The navbar should have a blurred dark glassmorphism background (bg-black/40 backdrop-blur-md border-b border-white/10). Left side displays the name text 'Surendar | Dev' in a clean, modern sans-serif font. Right side features a flex row of navigation links: 'Home', 'About', 'Projects', 'Blog', 'Contact', and a special 'Stargaze' option highlighted with a glowing border or subtle star icon. Every link must have a micro-interaction animation: on hover, a smooth horizontal sliding underline transitions into view, or the text changes color with an elastic scale bounce (scale: 1.05) using Framer Motion or clean CSS transitions."

Prompt 3: The About Me Container & Tactical Playbook Cards

System Prompt for Code Generation: "Design the code for an 'About Me' and 'Process' landing section layout. The wrapper cards must use an ultra-premium dark glassmorphism style (bg-[#0c0c14]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8). Inside the layout, cleanly arrange full-stack profile text columns alongside subtle design features that seamlessly blend a high-end tech developer look with minimalist, abstract artistic styling. On hover, the container card must trigger a beautiful dual-layered animation: the border should dynamically transition to a soft cyan or indigo glow color, and a low-opacity internal background gradient (bg-gradient-to-br from-cyan-500/5 to-purple-500/5) should softly fade into view over 300ms."

Prompt 4: The Scroll-Triggered Sequential Timeline

System Prompt for Code Generation: "Build a responsive vertical timeline component for an 'Education Journey' or 'Work Experience' page section. The timeline consists of a thin, dotted or solid glowing vertical path line centered down the screen. Branching off this line alternate card blocks. Use an animation library like Framer Motion or GSAP to attach scroll triggers: as the user scrolls down the page, each card container must sequentially fade in and slide up gracefully (initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }) with a smooth cubic-bezier easing. The scroll triggers must only execute once per page load to ensure clean, professional page performance."

Prompt 5: The WebGL Interactive 3D Galaxy Room ("Stargaze" View)

System Prompt for Code Generation: "Write a complete Three.js or React Three Fiber (R3F) script to create a standalone full-screen 3D interactive particle scene representing a rotating galaxy space room. Generate a custom BufferGeometry using a logarithmic spiral formula to map out exactly 50,000 vertex particle points spread across 4 distinct spiral arms. The colors of the particles must transition seamlessly using vector interpolation (lerp): bright gold/white #ffe3a0 at the dense core center, blending out to a deep neon blue/purple #1932ff at the edges of the spiral arms. Enable OrbitControls so the user can click-and-drag to smoothly rotate the entire galaxy in 3D space, and include an interaction handler where double-clicking a star group smoothly repositions the camera focus directly onto that coordinate point using a smooth camera pan tween animation."FOR THE NAME SURENDAR FULL STACK DEVELOPER AND ALSO THEME IS SPACE BACKSIDE STARS BLINING ALL AND IF I MOVE HOUSE THE STARS TO MOVE ALLA NIMAMATIOSNA DN SATGAZE I NEED SAME ANIMATED

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2bd0ab3c-7414-4852-a283-8d7ea192ba90).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitLab and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
