# Tsunami 🌊

Tsunami is a mobile finance tracker and wallet app built with React Native (Expo).

**Let AI set everything up for you. Copy paste this into your agent's prompt:**

```
Go to this repo: https://github.com/micriver/tsunami-rn/ and follow the README instructions to set up Tsunami on my machine.
```

---

<details>
<summary><h2>🤖 For AI Agents</h2></summary>

**Your job**: Fully set up this project for the user. Run commands, ask questions, configure everything. The user should not need to touch the terminal.

### Step 1: Clone & Install

1. Clone the repository:

   ```bash
   git clone https://github.com/micriver/tsunami-rn.git
   cd tsunami-rn
   ```

2. Verify Node.js is installed (v18+ required):

   ```bash
   node --version
   ```

   - If not installed or outdated, guide the user through installation for their OS.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Fix any Expo version mismatches:
   ```bash
   npx expo install --check
   ```

### Step 2: User Configuration (Ask These Questions)

**You MUST ask the user each question and wait for their response before proceeding.**

---

**Question 1: "What is your development setup?"**

| Option | Description                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------- |
| A      | **macOS** - I'll use the iOS Simulator                                                         |
| B      | **macOS/Windows/Linux** - I'll use an Android Emulator                                         |
| C      | **Any OS + Physical iPhone/Android** - I'll run the server locally and connect via Expo Go app |

Based on their answer:

- **Option A**: Verify Xcode is installed. Run `npm run ios`.
- **Option B**: Verify Android Studio and an emulator are configured. Run `npm run android`.
- **Option C**:
  1. Instruct user to install **Expo Go** on their phone from the App Store or Play Store.
  2. Run `npm start` to start the development server.
  3. Tell user: _"Scan the QR code shown in your terminal with your phone's camera (iPhone) or the Expo Go app (Android). Your phone and computer must be on the same WiFi network."_

---

**Question 2: "Do you want to use live market data or mock data?"**

| Option | Description                                                         |
| ------ | ------------------------------------------------------------------- |
| A      | **Live data** - Real prices from an external API (requires API key) |
| B      | **Mock data** - Fake sample data for development/testing            |

Based on their answer:

- **Option A (Live data)**:

  1. Ask: _"Please provide your CoinGecko API key. You can get a free one at https://www.coingecko.com/en/api"_
  2. Create a `.env` file in the project root with:
     ```
     EXPO_PUBLIC_USE_MOCK_DATA=false
     EXPO_PUBLIC_COINGECKO_API_KEY=<user's key here>
     ```
  3. **Do NOT read or display the contents of `.env` after creation.**

- **Option B (Mock data)**:
  1. Create a `.env` file in the project root with:
     ```
     EXPO_PUBLIC_USE_MOCK_DATA=true
     ```

---

**Question 3: "Do you prefer dark mode or light mode as the default?"**

| Option | Description               |
| ------ | ------------------------- |
| A      | **Dark mode** (default)   |
| B      | **Light mode**            |
| C      | **Follow system setting** |

Store their preference. This can be changed later in the app settings.

---

### Step 3: Launch the App

Based on the user's setup choice in Step 2, run the appropriate command:

```bash
# For iOS Simulator
npm run ios

# For Android Emulator
npm run android

# For Expo Go on physical device
npm start
```

### Step 4: Confirm Success

Once the app is running, tell the user:

> "Tsunami is running! 🌊 You should see the app on your [simulator/emulator/phone]. The home screen shows market prices. Try tapping on a coin to see the detail chart."

If there are errors, help the user debug. Common issues:

- **Metro bundler port in use**: Kill other processes on port 8081
- **Expo Go can't connect**: Ensure phone and computer are on same WiFi
- **iOS build fails**: Run `cd ios && pod install && cd ..` (macOS only)

</details>

---

## 📱 For Humans

### Quick Start (Manual)

```bash
git clone https://github.com/micriver/tsunami-rn.git
cd tsunami-rn
npm install
npm start
```

Scan the QR code with Expo Go on your phone.

### Current Features

- **Real-time Price Tracking** - Live market prices
- **Watchlist** - Save your favorite assets
- **News Feed** - Latest market news
- **Dark Mode** - Easy on the eyes

### Coming Soon

- **Wallet** - Send and receive with smart protocol detection
- **Portfolio Tracking** - See your holdings at a glance
- **Price Alerts** - Get notified when prices move

---

### Screenshots

**June 2025**

<img src="./assets/images/6.21.25.jpeg" height="500">

**May 2023**

<img src="./assets/images/5.20.23.png" height="400">

---

## License

MIT
