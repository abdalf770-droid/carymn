import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarSchema, insertContactSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import express from "express";

// Configure multer for image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Car routes
  app.get("/api/cars", async (req, res) => {
    try {
      const { make, bodyType, minPrice, maxPrice, minYear, maxYear } = req.query;
      
      const filters: any = {};
      if (make) filters.make = make as string;
      if (bodyType) filters.bodyType = bodyType as string;
      if (minPrice) filters.minPrice = parseInt(minPrice as string);
      if (maxPrice) filters.maxPrice = parseInt(maxPrice as string);
      if (minYear) filters.minYear = parseInt(minYear as string);
      if (maxYear) filters.maxYear = parseInt(maxYear as string);

      const cars = Object.keys(filters).length > 0 
        ? await storage.getCarsByFilters(filters)
        : await storage.getAllCars();
      
      res.json(cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
      res.status(500).json({ message: "خطأ في جلب السيارات" });
    }
  });

  app.get("/api/cars/featured", async (req, res) => {
    try {
      const cars = await storage.getFeaturedCars();
      res.json(cars);
    } catch (error) {
      console.error("Error fetching featured cars:", error);
      res.status(500).json({ message: "خطأ في جلب السيارات المميزة" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const car = await storage.getCar(req.params.id);
      if (!car) {
        return res.status(404).json({ message: "السيارة غير موجودة" });
      }
      res.json(car);
    } catch (error) {
      console.error("Error fetching car:", error);
      res.status(500).json({ message: "خطأ في جلب السيارة" });
    }
  });

  app.post("/api/cars", upload.array('images', 10), async (req, res) => {
    try {
      const carData = insertCarSchema.parse(req.body);
      
      // Handle uploaded images
      const images = req.files as Express.Multer.File[];
      if (images && images.length > 0) {
        carData.images = images.map(file => `/uploads/${file.filename}`);
      }

      const car = await storage.createCar(carData);
      res.status(201).json(car);
    } catch (error) {
      console.error("Error creating car:", error);
      res.status(400).json({ message: "خطأ في إنشاء السيارة" });
    }
  });

  app.put("/api/cars/:id", upload.array('images', 10), async (req, res) => {
    try {
      const updateData = { ...req.body };
      
      // Handle uploaded images
      const images = req.files as Express.Multer.File[];
      if (images && images.length > 0) {
        updateData.images = images.map(file => `/uploads/${file.filename}`);
      }

      const car = await storage.updateCar(req.params.id, updateData);
      if (!car) {
        return res.status(404).json({ message: "السيارة غير موجودة" });
      }
      res.json(car);
    } catch (error) {
      console.error("Error updating car:", error);
      res.status(400).json({ message: "خطأ في تحديث السيارة" });
    }
  });

  app.delete("/api/cars/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCar(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "السيارة غير موجودة" });
      }
      res.json({ message: "تم حذف السيارة بنجاح" });
    } catch (error) {
      console.error("Error deleting car:", error);
      res.status(500).json({ message: "خطأ في حذف السيارة" });
    }
  });

  // Contact routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "خطأ في جلب الرسائل" });
    }
  });

  app.get("/api/contacts/unread", async (req, res) => {
    try {
      const contacts = await storage.getUnreadContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching unread contacts:", error);
      res.status(500).json({ message: "خطأ في جلب الرسائل غير المقروءة" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(400).json({ message: "خطأ في إرسال الرسالة" });
    }
  });

  app.put("/api/contacts/:id/read", async (req, res) => {
    try {
      const marked = await storage.markContactAsRead(req.params.id);
      if (!marked) {
        return res.status(404).json({ message: "الرسالة غير موجودة" });
      }
      res.json({ message: "تم وضع علامة كمقروءة" });
    } catch (error) {
      console.error("Error marking contact as read:", error);
      res.status(500).json({ message: "خطأ في تحديث الرسالة" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContact(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "الرسالة غير موجودة" });
      }
      res.json({ message: "تم حذف الرسالة بنجاح" });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "خطأ في حذف الرسالة" });
    }
  });

  // Serve uploaded images
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
