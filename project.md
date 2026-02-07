🛠️ The "Antigravity" Tech Stack
Frontend: Next.js (App Router) + Tailwind CSS + Framer Motion.

Backend: Antigravity (handling the high-speed API routes and AI orchestration).

AI: Gemini API (for the Vision analysis).

Database: Supabase (Real-time community leaderboard & heritage pins).

Deployment: Vercel (Frontend) + Railway/Render (for the Antigravity backend).

⏱️ 18-Hour Project Plan
Phase 1: Foundation & "The Look" (Hours 1–4)
Task: Initialize Next.js with Poppins font and your "Nature" theme colors.

Antigravity Setup: Set up the basic Antigravity server with two routes: /health and /analyze.

UI: Build the "Mobile Frame" layout. Create a bottom navigation bar: Map, Camera, Leaderboard.

Milestone: A live URL on Vercel showing a clean, empty map.

Phase 2: The "Vision" Engine (Hours 5–8)
Task: Connect the Camera to your Antigravity backend.

AI Logic: Implement the Gemini Vision API call within an Antigravity controller.

Prompting: Tell the AI to look for "Signs of decay, graffiti, or structural instability" and return JSON.

Milestone: You take a photo on your phone, and the app displays: "Checking for damage..." then shows a result.

Phase 3: The "Community" Layer (Hours 9–13)
Task: Integrate Supabase for the community features.

Features:

Map Pins: Fetch the 5 hardcoded heritage sites from Supabase.

The "Check-in": Use the Browser Geolocation API. If distance < 50m, enable the "Vision Scan."

Leaderboard: Create a simple table showing "Top Guardians."

Milestone: You can "Capture" a site on the map and see your score go up.

Phase 4: Polish & Pitch (Hours 14–18)
Crucial Step: Stop adding features.

Animations: Use framer-motion to make the "Success" screen feel rewarding (soft green fades, bouncy icons).

The Video: Record a 4-minute demo.

Highlight: "We used Antigravity for a lightning-fast backend to process AI vision in real-time."

Highlight: "This addresses SDG 11.4 by gamifying the protection of our local 'Kin' (Heritage)."

💡 Winning "Antigravity" Insights
Since you are using Antigravity, emphasize these two points to the judges:

Efficiency: "Our backend uses Antigravity to ensure minimal latency during heavy AI image processing."

Scalability: "The lightweight nature of the stack allows it to run on low-power devices, making it accessible to more community members."

Next Step
Since you are using Next.js, would you like the Tailwind configuration for that "Nature/Clean" palette (Forest Green, Eggshell, and Terracotta) to make the UI look professional immediately?
