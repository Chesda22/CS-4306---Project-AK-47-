export const generateTips = (data) => {
  const tips = [];

  // Driving


  // Electricity
  if (data.electricity > 150) {
    tips.push("Use LED bulbs to save energy at home.");
  }

  if (data.electricity > 200) {
    tips.push("Turn off and unplug things when you're not using them.");
  }

  // Meat
  if (data.meatMeals > 10) {
    tips.push("Eating less meat is good for you and the Earth.");
  }

  if (data.meatMeals > 14) {
    tips.push("Try one meat-free day each week — it makes a difference!");
  }

  // Recycling
  if (!data.recycles) {
    tips.push("Start recycling at home if you can.");
  }

  // Showers
  if (data.showersPerDay && data.showersPerDay > 1) {
    tips.push("One shower a day is enough — saves water and energy.");
  }

  // Screen time
  if (data.deviceTime && data.deviceTime > 8) {
    tips.push("Take breaks from screens — it's good for you and saves power.");
  }

  // Garden
  if (data.hasGarden) {
    tips.push("Use your garden to grow food or make compost.");
  }

  // Always show this
  tips.push("Tell a friend — helping the Earth is better together!");

  return tips;
};
