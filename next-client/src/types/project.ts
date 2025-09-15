import { z } from "zod";
import { DocumentType } from "./document";

//Base Project Schema
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  description: z.string().nullable().optional(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Project = z.infer<typeof projectSchema>;

// Create project form inputs
export const createProjectFormSchema = projectSchema.pick({
  title: true,
  description: true,
});
export type CreateProjectFormInputs = z.infer<typeof createProjectFormSchema>;

// Update project form inputs
export const updateProjectFormSchema = projectSchema
  .pick({ title: true, description: true })
  .partial();

export type UpdateProjectFormInputs = z.infer<typeof updateProjectFormSchema>;

// Project Member Schema
export const projectMemberSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  invitationStatus: z.enum(["pending", "invited"]),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type ProjectMember = z.infer<typeof projectMemberSchema>;

// AssignedBy & AssignedTo Types
export type AssignedBy = {
  id: string;
  name: string;
  type: "owner" | "member";
};

export type AssignedTo = {
  id: string;
  name: string;
};

// Full Project for getUserProjectById
export type ProjectMemberWithUser = ProjectMember & {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
};

export type FullProject = Project & {
  projectMembers: ProjectMemberWithUser[];
  document: DocumentType;
};
