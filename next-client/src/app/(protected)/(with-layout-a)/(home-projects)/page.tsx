"use client";

// Home "/" Projects list page
import ConfirmationModal from "@/components/layout/confirmation-modal";
import s from "./project.module.scss";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { PageLoader } from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import { errorToast, successToast } from "@/components/ui/toast";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetUserProjectsQuery,
} from "@/redux/apis/projectApiSlice";
import {
  CreateProjectFormInputs,
  createProjectFormSchema,
} from "@/types/project";
import { parseError } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, Trash2 } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Projects = () => {
  const { data, isLoading } = useGetUserProjectsQuery();

  const [createProject, setCreateProject] = useState(false);
  const [deleteProject, setDeleteProject] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [create, { isLoading: loadingCreateProject }] =
    useCreateProjectMutation();

  const createForm = useForm<CreateProjectFormInputs>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onCreateSubmit = async (data: CreateProjectFormInputs) => {
    try {
      const res = await create(data).unwrap();
      if (res.success) {
        successToast(res.message);
        setCreateProject(false);
        createForm.reset();
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  const [deleteP, { isLoading: loadingDeleteProject }] =
    useDeleteProjectMutation();

  const handleDeleteProject = async () => {
    if (!deleteProject) {
      return;
    }
    try {
      const res = await deleteP(deleteProject.id).unwrap();
      if (res.success) {
        successToast(res.message);
        setDeleteProject(null);
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <section className="page-container-col">
          <div className="page-header">
            <h3>
              Projects <span>({data?.data?.length || 0})</span>
            </h3>

            <Button variant="primary" onClick={() => setCreateProject(true)}>
              +Create
            </Button>
          </div>

          <div
            className={s.projects}
            style={{
              gridTemplateColumns:
                data?.data && data?.data?.length < 5
                  ? "repeat(auto-fit, minmax(200px, 250px))"
                  : undefined,
            }}
          >
            {data?.data.map((p) => {
              return (
                <Link
                  href={`/project/${p.id}/document`}
                  className={s.project_card}
                  key={p.id}
                >
                  <span>
                    <Folder size={20} />
                  </span>

                  <div>
                    <h4>{p.title}</h4>
                    <p>
                      Created on: {moment(p.createdAt).format("DD-MM-YYYY")}
                    </p>
                  </div>

                  <Button
                    variant="bordered_sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteProject({
                        id: p.id as string,
                        title: p.title,
                      });
                    }}
                  >
                    <span>
                      <Trash2 size={16} color="var(--color-red)" />
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Modals */}
      {createProject && (
        <Modal heading="Create Project" onClose={() => setCreateProject(false)}>
          <div className="modal-content">
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)}>
              <FormInput
                form={createForm}
                id="title"
                label="Project title"
                placeholder="Enter project title"
                variant="input"
                type="text"
              />

              <FormInput
                form={createForm}
                id="description"
                label="Project description"
                placeholder="Enter project description"
                variant="input"
                type="text"
              />

              <div className="modal-action-btns">
                <Button variant="primary" disabled={loadingCreateProject}>
                  {loadingCreateProject ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {deleteProject && (
        <ConfirmationModal
          onClose={() => setDeleteProject(null)}
          onConfirm={handleDeleteProject}
          loadingConfirm={loadingDeleteProject}
          title={`Delete Project: ${deleteProject.title}`}
          message="Are you sure you want to delete this project? This action cannot be undone. Please click on confirm to proceed."
        />
      )}
    </>
  );
};

export default Projects;
