
# Sahbi prototype: rules for every request

Project: front-end PROTOTYPE of "Sahbi", a Windows desktop companion for computer science students. It links Google Classroom / Gmail / Calendar with the student's files and Git projects. It watches, finds, links and PROPOSES actions, and only acts after the student agrees.

## Technical rules

- React + Vite + TypeScript + Tailwind CSS v4 (@tailwindcss/vite plugin) + React Router + lucide-react. The Vite project already exists.
- NO backend, NO database, NO auth, NO fetch, NO localStorage/sessionStorage. All fake data lives in src/data.ts and in a React context store.
- All visible text in FRENCH, very short. Code, comments, variable names and routes in English. Light theme only.
- Compact code, small reusable components, no tests, no long comments, no extra features.
- After each task, run `npm run build` and fix every error before finishing.

## Safety rules (UI)

- Render ALL external text (assignment titles, email summaries, file names) as plain text. Never use dangerouslySetInnerHTML or innerHTML.
- No button sends an email, deletes a file, changes a Classroom submission or launches a program.
- Never ask for passwords, tokens or API keys.

## Design system

- Goal: beautiful, friendly, airy, never cluttered, VERY LITTLE text. Prefer icons, big numbers and colors over sentences. Max one short line per card. Max 3 blocks visible per zone. ONE primary button per card.
- Font: Plus Jakarta Sans (Google Fonts), bold titles.
- Background #FAF8F5. Cards white, 24px radius, large soft shadow, no hard borders.
- Primary violet #6D5DFB with gradient to #8B7CFF. Accent coral #FF7A6B. Accent mint #4FD1A5. Text #1F1B2E, secondary #7A758C.
- Green / orange / red ONLY for status dots and alerts. Red only for urgent.
- Course pastel colors: Réseaux blue, Bases de données purple, Programmation Java orange, Algorithmique pink, Génie logiciel teal, Systèmes d'exploitation yellow. Shown as a colored strip or icon bubble on every assignment, email and event.
- Soft animations only: fade-in on page load, gentle hover lift, small bounce on "Accepter", success check.
- Friendly empty states with the mascot, e.g. "Aucun devoir urgent. Profitez-en !".

## Layout

- Narrow icon-only left sidebar (72px): Accueil, Devoirs, Agenda, Emails, Recherche, Propositions (coral badge with pending count), Journal. At the bottom: avatar, Paramètres, Aide. Active = filled violet bubble, name in a tooltip.
- "Planification" has no sidebar icon (it lives in the assignment page). "Projets" appears in the sidebar only when the setting "Suivre mes projets" is on.
- Slim light top bar: round search field "Rechercher dans mes documents…" (Enter opens /search), one status dot per source (Classroom, Agenda, Gmail, Fichiers, Git only if projects are tracked) with tooltip, round "Pause" button.
- Status dots: ok green, syncing orange (subtle pulse), problem red, disconnected gray, paused gray + pause symbol. When paused: all dots gray and a small banner "Sahbi est en pause". Clicking a red dot shows a message and a button "Me reconnecter".

## Mascot

Inline SVG component "Mascot": a round, smiling, soft violet blob with two eyes and tiny arms. No external images.
