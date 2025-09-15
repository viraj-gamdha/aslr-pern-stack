import {
  document,
  DocumentType,
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
import { verifyProjectOwnerShip } from "@/utils/project.js";

// Create a new project with related data
export const createProject = TryCatch<Partial<NewProject>, {}, {}, {}, Project>(
  async (req, res, next) => {
    const userId = req.userId as string; // UserId from middleware
    const { title, description } = req.body;

    if (!title) {
      return next(new ErrorHandler(400, "Title is required"));
    }

    // Use transaction to ensure project and document are created together
    const [newProject] = await db.transaction(async (tx) => {
      // Create project
      const [createdProject] = await tx
        .insert(project)
        .values({
          title,
          description,
          userId,
        })
        .returning();

      // Create associated document
      const [createdDocument] = await tx
        .insert(document)
        .values({
          content: "", // Initialize with default TipTap content
          projectId: createdProject.id,
        })
        .returning();

      return [{ ...createdProject, document: createdDocument }];
    });

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
    message: "Project details updated successfully",
    data: updatedProject,
  });
});

// Get all projects for the authenticated user (owned and member projects)
export const getUserProjects = TryCatch<
  {},
  {},
  {},
  {},
  {
    id: string;
    title: string;
    createdAt: Date;
    assignedBy: {
      id: string;
      name: string;
      type: string;
    };
    assignedTo: {
      id: string;
      name: string;
    }[];
  }[]
>(async (req, res, next) => {
  const userId = req.userId as string;

  // Owned projects with members
  const ownedProjects = await db.query.project.findMany({
    where: eq(project.userId, userId),
    with: {
      projectMembers: {
        with: {
          user: true,
        },
      },
    },
  });

  // Member projects with owner
  const memberProjects = await db.query.projectMember.findMany({
    where: eq(projectMember.userId, userId),
    with: {
      project: {
        with: {
          owner: true,
          projectMembers: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });

  // Transform owned projects
  const owned = ownedProjects.map((proj) => ({
    id: proj.id,
    title: proj.title,
    createdAt: proj.createdAt,
    assignedBy: {
      id: userId,
      name:
        proj.projectMembers.find((m) => m.user.id === userId)?.user.name ?? "",
      type: "owner",
    },
    assignedTo: proj.projectMembers
      .filter((m) => m.invitationStatus === "invited")
      .map((m) => ({
        id: m.user.id,
        name: m.user.name,
      })),
  }));

  // Transform member projects
  const member = memberProjects.map(({ project }) => ({
    id: project.id,
    title: project.title,
    createdAt: project.createdAt,
    assignedBy: {
      id: project.owner.id,
      name: project.owner.name,
      type: "member",
    },
    assignedTo: project.projectMembers
      .filter((m) => m.invitationStatus === "invited")
      .map((m) => ({
        id: m.user.id,
        name: m.user.name,
      })),
  }));

  return res.status(200).json({
    success: true,
    message: "Projects retrieved successfully",
    data: [...owned, ...member],
  });
});

// Get a specific project by ID
export const getUserProjectById = TryCatch<{}, { id: string }, {}, {}, {}>(
  async (req, res, next) => {
    const userId = req.userId as string; // UserId from middleware
    const { id } = req.params;

    // Fetch project with its members using ORM relations
    // also other project data like document
    const projectDataVerified = await verifyProjectOwnerShip(userId, id);

    // Trim user fields
    const projectData = {
      ...projectDataVerified,
      projectMembers: projectDataVerified.projectMembers.map((member) => ({
        ...member,
        user: {
          name: member.user.name,
          email: member.user.email,
          createdAt: member.user.createdAt,
        },
      })),
    };

    return res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: projectData,
    });
  }
);

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
  await verifyProjectOwnerShip(userId, id);

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

  await verifyProjectOwnerShip(userId, projectId);

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
