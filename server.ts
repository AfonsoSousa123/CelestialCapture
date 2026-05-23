import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from './server/db.js';
import { users, photos } from './server/schema.js';
import { eq } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '50mb' })); // Increase limit for local base64 uploads

  // API ROUTES GO HERE FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Users Routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }
      const [newUser] = await db.insert(users).values({ name, email }).returning();
      res.json({ user: newUser });
    } catch (error: any) {
      if (error.code === '23505') {
        res.status(400).json({ error: "Email already exists" });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error" });
      }
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });
      
      const userList = await db.select().from(users).where(eq(users.email, email));
      const user = userList[0] || null;
      if (!user) {
        return res.status(401).json({ error: "Invalid email" });
      }
      res.json({ user });
    } catch(err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Photos Routes
  app.post("/api/photos", async (req, res) => {
    try {
      const { url, title, description, userId } = req.body;
      if (!url || !title || !userId) {
        return res.status(400).json({ error: "URL, Title, and User ID are required" });
      }
      const [newPhoto] = await db.insert(photos).values({ url, title, description, userId }).returning();
      res.json({ photo: newPhoto });
    } catch (error) {
      console.error("Photo upload error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.put("/api/photos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      
      const [updatedPhoto] = await db.update(photos)
        .set({ title, description })
        .where(eq(photos.id, id))
        .returning();
        
      if (!updatedPhoto) {
         return res.status(404).json({ error: "Photo not found" });
      }

      res.json({ photo: updatedPhoto });
    } catch (error) {
      console.error("Photo update error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  app.delete("/api/photos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const [deletedPhoto] = await db.delete(photos)
        .where(eq(photos.id, id))
        .returning();
        
      if (!deletedPhoto) {
        return res.status(404).json({ error: "Photo not found" });
      }

      res.json({ success: true, photo: deletedPhoto });
    } catch (error) {
       console.error("Photo delete error:", error);
       res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/photos", async (req, res) => {
    try {
      const allPhotos = await db.select().from(photos).orderBy(photos.createdAt);
      // Let's reverse them so that newest are first
      allPhotos.reverse();
      res.json({ photos: allPhotos });
    } catch (error) {
      console.error("Fetch photos error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
