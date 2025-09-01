"use client";

import { useGetUserProjectByIdQuery } from "@/redux/apis/projectApiSlice";
import s from "./document.module.scss";
import { useParams } from "next/navigation";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  File,
  History,
  SaveIcon,
  TableProperties,
} from "lucide-react";
import { SkeletonLoader } from "@/components/ui/loader";

const Document = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, isLoading } = useGetUserProjectByIdQuery(projectId);

  return (
    <div className="layout-a">
      <header className={s.header}>
        <h4 className="truncate-text" title={data?.data.title}>
          {isLoading ? (
            <SkeletonLoader style={{ height: "1.5rem", width: "6rem" }} />
          ) : (
            data?.data?.title
          )}
        </h4>

        <div className={s.header_wrapper}>
          <Tooltip tooltip="Table of contents" bottom>
            <Button variant="icon">
              <span>
                <TableProperties size={18} />
              </span>
            </Button>
          </Tooltip>

          <Tooltip tooltip="View history" bottom>
            <Button variant="icon">
              <span>
                <History size={18} />
              </span>
            </Button>
          </Tooltip>

          <Tooltip tooltip="View abstract" bottom>
            <Button variant="icon">
              <span>
                <File size={18} />
              </span>
            </Button>
          </Tooltip>
        </div>

        <div className={s.header_wrapper} style={{ marginLeft: "auto" }}>
          <Button variant="icon_bordered">
            <span>
              <SaveIcon size={18} />
            </span>
            Save
          </Button>

          <Button variant="icon_bordered">
            <span>
              <DownloadIcon size={18} />
            </span>
            Export
          </Button>
        </div>
      </header>

      <div className="layout-content-wrapper">
        <section className={s.content}></section>
      </div>
    </div>
  );
};

export default Document;
