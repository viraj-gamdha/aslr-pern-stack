import {
  createProject,
  deleteProject,
  getUserProjects,
  updateProject,
} from "@/controllers/project.js";
import { verifyAuth } from "@/middlewares/verifyAuth.js";
import { Router } from "express";

const projectRoutes = Router();

projectRoutes.use(verifyAuth);
projectRoutes.post("/create", createProject);
projectRoutes.put("/update/:id", updateProject);
projectRoutes.get("/", getUserProjects);
projectRoutes.delete("/:id", deleteProject);

// todo later: user invitation so skip it for now

export { projectRoutes };
