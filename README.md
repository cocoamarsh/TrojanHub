# ChapelHub — Starter Website 💙

This is a functional **front-end prototype**, not a live multi-user website.

## How to run it

1. Unzip the folder and open it in Visual Studio Code.
2. Open `index.html` in your browser, or install the VS Code **Live Server** extension and select **Open with Live Server**.
3. Try the four features: Lunch Ratings, Daily Poll, Lost & Found, Trojan Challenge.

## Files

- `index.html` — page structure
- `styles.css` — ChapelHub colors and responsive design
- `script.js` — features, interactions, and browser storage

## Important limitation

Each browser stores its **own** ratings, votes, lost-item posts and game progress using `localStorage`. Data is not shared across students, and it can disappear when browser data is cleared. Do not claim the app has a real leaderboard or school-wide live results yet.

## Where to customize

- Home cards: `views.home` in `script.js`.
- Daily poll question and options: `views.poll`.
- Trivia questions: `questions` array in `views.challenge`. Current demo rotates 5 questions.
- Colors and spacing: `styles.css` (search `#153e85` and `#16438e`).
- School menu: `views.lunch` currently contains a placeholder because there is no connected menu source.

## Next steps

1. Get feedback from classmates about which section solves a real problem.
2. Build one shared backend, e.g. Supabase, for real-time data and safe sign-in.
3. Add an admin interface for menu, polls and daily questions.
4. Add moderation for Lost & Found, and school-approved handling of items.
5. Publish only with school approval. Avoid collecting identifiable student information unnecessarily.

This website is an unofficial student prototype.
# TrojanHub
