import express, { type Express, type Request } from "express";

// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
import { createServer, type Server } from "http";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./models/users"; // Mongoose user model
// import { setupAuth } from "./auth"; // Auth middleware

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "matoub_le_boss";

// Route de création d'utilisateur simplifiée sans Zod
router.post("/users", async (req, res) => {
  try {
    console.log("Données reçues:", req.body);
    
    // Créer directement l'utilisateur avec mongoose
    const user = new User(req.body);
    
    // Sauvegarder l'utilisateur
    await user.save();
    
    // Répondre avec succès
    res.status(201).json({ 
      message: "Utilisateur créé avec succès", 
      user: {
        username: user.username,
        email: user.email,
        _id: user._id
      } 
    });
  } catch (error) {
    console.error("Erreur de création d'utilisateur:", error);
    
    // Gestion des erreurs de validation mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      const messages = Object.values((error as any).errors).map((val: any) => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    // Gestion des erreurs de duplicate (email ou username déjà utilisés)
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      const field = Object.keys((error as any).keyValue)[0];
      return res.status(400).json({ 
        error: `Ce ${field} est déjà utilisé` 
      });
    }
    
    // Autres erreurs
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Envoyer la réponse avec le token et les infos utilisateur (sans le mot de passe)
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
      sexe: user.sexe,
      illness: user.illness,
      allergy: user.allergy,
      created_at: user.created_at
    };

    res.status(200).json({
      token,
      user: userResponse,
      message: "Connexion réussie"
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// Middleware d'authentification à utiliser pour les routes protégées
export const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Accès non autorisé" });
    }

    const token = authHeader.split(" ")[1];
    
    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ajouter les infos utilisateur à l'objet request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return res.status(401).json({ error: "Token invalide" });
  }
};

// Route exemple protégée
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


export default router;

export async function registerRoutes(app: Express): Promise<Server> {
  // Enregistre les routes utilisateur avec /api/users
  app.use("/", router);

  const httpServer = createServer(app);
  return httpServer;
}
