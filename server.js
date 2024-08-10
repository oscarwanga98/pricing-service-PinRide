const express = require("express");
const app = express();
const morgan = require('morgan');

const port = process.env.PORT || 3000;

// Mock data for demand, distance, and time of day
const baseFare = 5; // Base fare in dollars
const costPerMile = 2; // Cost per mile in dollars
const surgeMultiplier = 1.5; // Surge pricing multiplier during peak hours

// Function to calculate the price
function calculatePrice(distance, demand, timeOfDay) {
  let price = baseFare + costPerMile * distance;

  // Apply surge pricing based on demand and time of day
  if (demand > 7 && timeOfDay >= 17 && timeOfDay <= 20) {
    price *= surgeMultiplier;
  }

  return price;
}

//Morgan for monitoring 
app.use(morgan("combined"));

// API endpoint to get the price
app.get("/price", (req, res) => {
  const { distance, demand, timeOfDay } = req.query;

  if (!distance || !demand || !timeOfDay) {
    return res
      .status(400)
      .send("Missing required query parameters: distance, demand, timeOfDay");
  }

  const price = calculatePrice(
    parseFloat(distance),
    parseInt(demand),
    parseInt(timeOfDay)
  );
  res.json({ price });
});

// Start the server
app.listen(port, () => {
  console.log(`Pricing service running on port ${port}`);
});
