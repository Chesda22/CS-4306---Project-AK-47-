export const generateTips = (data) => {
  const tips = [];

  // Driving
  if (data.drivingMiles > 100) {
    tips.push("Drive less — try walking, biking, or carpooling sometimes.");
  }

  if (data.drivingMiles > 200) {
    tips.push("Cutting down how much you drive can really help the planet.");
  }

  // Flying
  if (data.flights > 5) {
    tips.push("Try to fly less or combine trips when you can.");
  }

  if (data.flights > 10) {
    tips.push("Planting trees can help balance out your flight emissions.");
  }

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
