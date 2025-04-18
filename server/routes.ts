import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { User } from "./models/users"; // Mongoose user model
import { setupAuth } from "./auth"; // Auth middleware

const router = express.Router();

// Route de création d'utilisateur
router.post("/", async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body); // Validation Zod
    const user = new User(userData);
    await user.save();
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;

export async function registerRoutes(app: Express): Promise<Server> {
  // Enregistre les routes utilisateur avec /api/users
  app.use("/api/users", router);

  // Air Quality Proxy Endpoint
  app.get("/api/air-quality", async (req, res) => {
    setupAuth(app);
    try {
      const lat = req.query.latitude;
      const lon = req.query.longitude;

      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`
      );

      if (!response.ok) throw new Error(`Error fetching air quality data: ${response.status}`);

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Air quality API error:", error);
      res.status(500).json({ error: "Failed to fetch air quality data" });
    }
  });

  // Pollen Proxy Endpoint
  app.get("/api/pollen", async (req, res) => {
    try {
      const lat = req.query.latitude;
      const lon = req.query.longitude;

      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&daily=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=auto`
      );

      if (!response.ok) throw new Error(`Error fetching pollen data: ${response.status}`);

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Pollen API error:", error);
      res.status(500).json({ error: "Failed to fetch pollen data" });
    }
  });

  // Weather Proxy Endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const lat = req.query.latitude;
      const lon = req.query.longitude;

      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m,weather_code,pressure_msl,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max&timezone=auto`
      );

      if (!response.ok) throw new Error(`Error fetching weather data: ${response.status}`);

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
