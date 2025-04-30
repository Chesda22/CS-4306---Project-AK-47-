# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


# 🌿 Carbon Footprint Calculator

A React Native + Expo app that helps users estimate their carbon footprint based on energy, travel, and lifestyle habits — complete with tips, comparisons, gamified scoring, and tree offset suggestions.

## ✨ Features

- 🔢 **Carbon Emissions Calculator** for electricity, gasoline, meat, transport, and recycling
- 💡 **Smart Tips Generator** — personalized advice to reduce emissions
- 📊 **Breakdown Report** — emission source-by-source
- 🌍 **World & National Comparison** — see how you stack up
- 🏅 **Gamified Badges** — "Green Champion", "Eco-Warrior", etc.
- 🌳 **Tree Offset Estimator** — shows how many trees you'd need
- 🎉 **Animated Confetti** and fade-in success message
- 🌗 **Light/Dark Mode Support**

## 📱 Screenshots

> (You can drag & drop screenshots here once you have them.)

## 🚀 Getting Started

1. Clone the repo:
```bash
git clone https://github.com/Chesda22/CS-4306---Project-AK-47-.git
```

2. Install dependencies:
```bash
cd CS-4306---Project-AK-47-
npm install
```

3. Run the project with Expo:
```bash
npx expo start
```

4. Scan the QR code using the **Expo Go** app on your phone

## 📦 Tech Stack

- React Native (via Expo)
- React Navigation / expo-router
- Reanimated 2
- Confetti Cannon

## 🧠 Logic Behind the Scenes

- Emission factors: fixed multipliers based on input types
- Score logic: compares user's CO₂ kg/year to world/US averages
- Badges: simple if/else based on thresholds
- Tips: generated using simple conditions



## 📜 License

MIT License — free to use and modify for educational purposes.

---

> "Sustainability starts with awareness — and awareness starts here."
