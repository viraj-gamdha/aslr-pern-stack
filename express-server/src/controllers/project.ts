import {
  NewProject,
  Project,
  project,
  ProjectMember,
  projectMember,
  user,
} from "@/db/schema/index.js";
import { eq, and } from "drizzle-orm";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import { db } from "@/db/dbInit.js";

// Create a new project
export const createProject = TryCatch<Partial<NewProject>, {}, {}, {}, Project>(
  async (req, res, next) => {
    const userId = req.userId as string; // UserId from middleware
    const { title, description } = req.body;

    if (!title) {
      return next(new ErrorHandler(400, "Title is required"));
    }

    const [newProject] = await db
      .insert(project)
      .values({
        title,
        description,
        userId,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  }
);

// Update project title and description
export const updateProject = TryCatch<
  Partial<NewProject>,
  { id: string },
  {},
  {},
  Project
>(async (req, res, next) => {
  const userId = req.userId as string; // UserId from middleware
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title && !description) {
    return next(new ErrorHandler(400, "No valid fields provided for update"));
  }

  // Check if project exists and user is the owner using ORM relations
  const existingProject = await db.query.project.findFirst({
    where: and(eq(project.id, id), eq(project.userId, userId)),
  });

  if (!existingProject) {
    return next(new ErrorHandler(404, "Project not found or unauthorized"));
  }

  const updateData: Partial<NewProject> = {
    updatedAt: new Date(),
  };
  if (title) updateData.title = title;
  if (description) updateData.description = description;

  const [updatedProject] = await db
    .update(project)
    .set(updateData)
    .where(eq(project.id, id))
    .returning();

  return res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: updatedProject,
  });
});

// Get all projects for the authenticated user (owned and member projects)
type ProjectWithAssignedBy = Project & {
  assignedBy: "owner" | "member";
};

export const getUserProjects = TryCatch<
  {},
  {},
  {},
  {},
  ProjectWithAssignedBy[]
>(async (req, res, next) => {
  const userId = req.userId as string; // UserId from middleware

  // Get projects where user is owner
  const ownedProjects = await db.query.project.findMany({
    where: eq(project.userId, userId),
  });

  // Get projects where user is a member using relations
  const memberProjects = await db.query.projectMember.findMany({
    where: eq(projectMember.userId, userId),
    with: {
      project: true,
    },
  });

  // Combine projects with assignedBy property
  const allProjects: ProjectWithAssignedBy[] = [
    ...ownedProjects.map((proj) => ({ ...proj, assignedBy: "owner" as const })),
    ...memberProjects.map(({ project }) => ({
      ...project,
      assignedBy: "member" as const,
    })),
  ];

  return res.status(200).json({
    success: true,
    message: "Projects retrieved successfully",
    data: allProjects,
  });
});

// Get a specific project by ID
export const getUserProjectById = TryCatch<
  {},
  { id: string },
  {},
  {},
  Project & { projectMembers: ProjectMember[] }
>(async (req, res, next) => {
  const userId = req.userId as string; // UserId from middleware
  const { id } = req.params;

  // Fetch project with its members using ORM relations
  const projectData = await db.query.project.findFirst({
    where: eq(project.id, id),
    with: {
      projectMembers: {
        where: eq(projectMember.userId, userId),
      },
    },
  });

  if (!projectData) {
    return next(new ErrorHandler(404, "Project not found"));
  }

  // Check if user is the owner or a member
  if (projectData.userId !== userId && !projectData.projectMembers.length) {
    return next(new ErrorHandler(403, "Unauthorized to access this project"));
  }

  return res.status(200).json({
    success: true,
    message: "Project retrieved successfully",
    data: projectData,
  });
});

// Delete a project
export const deleteProject = TryCatch<
  {},
  { id: string },
  {},
  {},
  { id: string }
>(async (req, res, next) => {
  const userId = req.userId as string; // UserId from middleware
  const { id } = req.params;

  // Check if project exists and user is the owner using ORM relations
  const existingProject = await db.query.project.findFirst({
    where: and(eq(project.id, id), eq(project.userId, userId)),
  });

  if (!existingProject) {
    return next(new ErrorHandler(404, "Project not found or unauthorized"));
  }

  await db.delete(project).where(eq(project.id, id));

  return res.status(200).json({
    success: true,
    message: "Project deleted successfully",
    data: { id: id },
  });
});

// Invite a user to a project
export const inviteUserToProject = TryCatch<
  { email: string },
  { projectId: string },
  {},
  {},
  ProjectMember
>(async (req, res, next) => {
  const userId = req.userId as string; // UserId from middleware
  const { projectId } = req.params;
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler(400, "Email is required"));
  }

  // Check if project exists and user is the owner using ORM relations
  const existingProject = await db.query.project.findFirst({
    where: and(eq(project.id, projectId), eq(project.userId, userId)),
  });

  if (!existingProject) {
    return next(new ErrorHandler(404, "Project not found or unauthorized"));
  }

  // Find user by email
  const invitedUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!invitedUser) {
    return next(new ErrorHandler(404, "User not found"));
  }

  if (invitedUser.id === userId) {
    return next(new ErrorHandler(400, "Cannot invite yourself"));
  }

  // Check if user is already a member using ORM relations
  const existingMember = await db.query.projectMember.findFirst({
    where: and(
      eq(projectMember.projectId, projectId),
      eq(projectMember.userId, invitedUser.id)
    ),
  });

  if (existingMember) {
    return next(new ErrorHandler(400, "User is already a project member"));
  }

  // Add user to project
  const [newMember] = await db
    .insert(projectMember)
    .values({
      projectId,
      userId: invitedUser.id,
    })
    .returning();

  return res.status(200).json({
    success: true,
    message: "User invited successfully",
    data: newMember,
  });
});
