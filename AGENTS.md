# AI Agent Workflow & Instructions

## 🤖 Directives
1. **Read `SPECS.md`** first for the product roadmap and technical vision.
2. **Context Awareness**: This file defines your operational parameters.

---

## 🛠 Operational Rules

### Git Workflow (IMPORTANT)
- **ALWAYS create a new branch** before starting any feature work.
- Branch naming: `feature/<feature-name>` or `fix/<bug-name>`
- Ask user: *"Should I create a branch for this? e.g. `feature/bottom-navigation`"*
- Never commit directly to `main`.

### Commands & Environment
- **Package Manager**: Use `npm` (Plan to migrate to Bun later).
- **Run Commands**: ALWAYS prefer `expo` commands:
  - ✅ `npx expo start`
  - ✅ `npx expo install <package>`
  - ❌ `npm start` (unless it explicitly runs expo)
- **Dev Client**: User uses **Expo Go** on a **Physical Device**. Avoid simulator-only commands.

### Code Style
- **Styling**: Strictly follow `src/theme/theme.js`.
- **No Hardcoded Values**: Colors, spacing, fonts must come from theme.
- **Dependencies**: Do not upgrade Expo unless explicitly asked.

### Testing
- Use `maestro` for UI flows.
- Take screenshots and analyze them if "AI Eyes" are enabled.

---

## 🎤 User Interview Script
(Run ONLY if user has not been onboarded)

1. **"What is your development environment?"**
   - (A) iOS Simulator (macOS)
   - (B) Android Emulator
   - (C) Physical Device (Expo Go) ← **Default for this project**

2. **"Do you want to run the 'Hacker Wave' startup animation?"**
   - (A) Yes, full visual effects.
   - (B) No, skip to home screen (faster dev).

3. **"Configure Mock Data?"**
   - (A) Use Live CoinGecko API (Requires Key).
   - (B) Use Mock Data (Offline/Free).

4. **"Lightning Node Preference?"**
   - (A) Breez SDK (Embedded light client).
   - (B) External Node (Zeus/LND - Advanced).
