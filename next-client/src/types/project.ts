import { z } from "zod";

// Base schema for project
export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional().nullable(),
  userId: z.string().optional(),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
  assignedBy: z.enum(["owner", "member"]).optional(),
});

export type Project = z.infer<typeof projectSchema>;

// Base schema for project member
export const projectMemberSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  userId: z.string().min(1, "User ID is required"),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

export type ProjectMember = z.infer<typeof projectMemberSchema>;

// Create project form inputs
export const createProjectFormSchema = projectSchema.pick({
  title: true,
  description: true,
});

export type CreateProjectFormInputs = z.infer<typeof createProjectFormSchema>;

// Update project form inputs
export const updateProjectFormSchema = projectSchema
  .pick({
    title: true,
    description: true,
  })
  .partial();

export type UpdateProjectFormInputs = z.infer<typeof updateProjectFormSchema>;