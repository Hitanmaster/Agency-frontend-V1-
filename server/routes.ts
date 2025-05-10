import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { MongoAgency, mongoAgencySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get all agencies sorted by scraped_date (newest first)
  app.get("/api/agencies", async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 12;
      const tag = req.query.tag as string | undefined;
      const search = req.query.search as string | undefined;
      const random = req.query.random === 'true'; // Convert to boolean
      
      console.log(`Fetching agencies: page=${page}, limit=${limit}, tag=${tag}, search=${search}, random=${random}`);
      
      const { agencies, totalCount } = await storage.getAgencies({
        page,
        limit,
        tag,
        search,
        random,
      });
      
      res.json({
        agencies,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      });
    } catch (error) {
      console.error("Error fetching agencies:", error);
      res.status(500).json({ message: "Failed to fetch agencies" });
    }
  });

  // API endpoint to get a single agency by ID
  app.get("/api/agencies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const agency = await storage.getAgencyById(id);
      
      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }
      
      res.json(agency);
    } catch (error) {
      console.error("Error fetching agency:", error);
      res.status(500).json({ message: "Failed to fetch agency" });
    }
  });

  // API endpoint to get available tags
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json({ tags });
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
