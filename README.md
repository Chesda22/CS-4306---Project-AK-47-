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


# Carbon Footprint Calculator App

An educational and interactive React Native Expo app that helps users estimate their monthly carbon footprint, gain awareness, and learn how to improve their sustainability impact.

## 🌟 Features

### 🔢 Footprint Calculator
- Input electricity, gasoline, meat consumption, public transport, and recycling habits.
- Calculates CO₂ emissions with real-world conversion factors.

### 📊 Emission Visualization
- Pie chart breakdown of emission sources (electricity, gasoline, meat, transport).
- Clear total with visually appealing result cards.

### 🧠 Tips Generator
- Provides practical, tailored tips based on user input.
- Encourages small habit changes for a lower footprint.

### 🏆 Badge System
- Users earn badges like:
  - 🏅 Green Champion (< 5 tons/year)
  - 🌱 Eco-Warrior (5–10 tons/year)
  - 🚨 Needs Improvement (> 15 tons/year)

### 📈 Comparisons
- Shows how the user's footprint compares to national and world averages.
- Example: "Your footprint is 20% higher than the average American."

### 🌳 Offset Estimator
- Calculates how many trees are needed to offset your footprint.
- Example: "You’d need to plant 40 trees to offset your emissions."

## 📚 Explore Tab (New!)

An interactive resource center with animated tabs:

### 🖼 Photos
- Greenhouse gas imagery and environmental visuals.

### 🔗 Useful Links
- NASA Climate, IPCC, EPA climate reports.

### 📖 Book Recommendations
- "This Changes Everything" – Naomi Klein
- "The Uninhabitable Earth" – David Wallace-Wells
- "How to Avoid a Climate Disaster" – Bill Gates

### 🌱 Environmental Organizations
- 350.org
- Greenpeace
- WWF

### ✨ Quote of the Day
- Daily environmental quote fetched from an API.
- Smooth fade-in/fade-out animation.
- Offline caching with AsyncStorage.
- 🔄 Refresh button to get a new quote.

## 🚀 Tech Stack
- React Native + Expo
- react-native-chart-kit
- react-native-reanimated
- AsyncStorage (quote caching)

## 📸 Screenshots
(Insert screenshots here if available)



## 📜 License

MIT License — free to use and modify for educational purposes.

---

> "Sustainability starts with awareness — and awareness starts here."
