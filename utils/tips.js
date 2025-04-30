export const generateTips = (data) => {
  const tips = [];

  // ⚡ Electricity
  if (data.electricity >= 0) {
    tips.push("So you're just getting started with electricity tracking — awesome! Just flipping off lights helps.");
  }
  if (data.electricity > 25) {
    tips.push("Hey, did you know unplugging unused chargers actually makes a difference? Sneaky phantom power!");
  }
  if (data.electricity > 50) {
    tips.push("Natural light is free! Try opening blinds instead of flipping switches during the day.");
  }
  if (data.electricity > 100) {
    tips.push("Okay, time to level up — LED bulbs and a smart thermostat are your new best friends.");
  }
  if (data.electricity > 150) {
    tips.push("Whoa, heavy usage! Ever thought of an energy audit or checking your insulation?");
  }
  if (data.electricity > 500) {
    tips.push("At this point, solar panels could seriously pay off — both for the planet and your wallet.");
  }

  // 🍖 Meat
  if (data.meatMeals >= 0) {
    tips.push("You're eating meat — totally fine! Want to try a veggie meal once a week? It helps!");
  }
  if (data.meatMeals > 50) {
    tips.push("Red meat's kinda like the boss-level emitter in diets. Maybe try more chicken, tofu, or beans?");
  }
  if (data.meatMeals > 100) {
    tips.push("How about a ‘Meatless Monday’? It’s easier than you think and actually fun to try new foods.");
  }
  if (data.meatMeals > 200) {
    tips.push("Okay, that's a lot of meat. Even just cutting it by 25% can reduce your footprint big time.");
  }
  if (data.meatMeals > 500) {
    tips.push("Alright champ, maybe time to rethink the steak habit. Your health and Earth both win.");
  }

  // ⛽ Gasoline
  if (data.gasoline >= 0) {
    tips.push("Short trips? Walking or biking could be a fun (and healthier) change.");
  }
  if (data.gasoline > 50) {
    tips.push("Public transport isn’t just for cities — even occasional bus rides help.");
  }
  if (data.gasoline > 100) {
    tips.push("Driving a lot? Carpooling once or twice a week makes a huge dent.");
  }
  if (data.gasoline > 150) {
    tips.push("Time to think fuel efficiency. A hybrid or electric vehicle might be worth a look.");
  }
  if (data.gasoline > 500) {
    tips.push("That’s quite a commute! Can you combine errands, go remote, or change your travel habits?");
  }

  // 🚌 Public Transport — the less used, the more we nudge
  if (data.publicTransport < 25) {
    tips.push("Not using public transport much? Just a couple rides a week could really shrink your footprint.");
  }
  if (data.publicTransport < 10) {
    tips.push("Ever tried taking a train or bus just once a week? Could be your new productivity pod!");
  }

  // 💬 Always end with a high note
  tips.push("You're doing better than you think — even small changes ripple out. Keep it up! 💪🌍");

  return tips;
};

