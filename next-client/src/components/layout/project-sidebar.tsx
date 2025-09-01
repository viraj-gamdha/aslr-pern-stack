"use client";

import s from "./project-sidebar.module.scss";
import {
  Atom,
  FilePenLine,
  FileSearch,
  Folder,
  Layout,
  Library,
  Lightbulb,
  ListCollapseIcon,
  LogOut,
  NotebookPen,
  TextSelect,
  User,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button, LinkButton } from "../ui/button";
import Link from "next/link";
import { useSignout } from "@/hooks/useSignout";
import Tooltip from "../ui/tooltip";
import classNames from "classnames";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { media } from "@/styles/media";

const projectLinks = [
  { title: "Document", url: "document", icon: FilePenLine },
  { title: "Literature Review", url: "literature-review", icon: TextSelect },
  { title: "Search Papers", url: "search-papers", icon: FileSearch },
  { title: "Essay Writing", url: "essay-writing", icon: NotebookPen },
  { title: "Citations", url: "citations", icon: ListCollapseIcon },
  { title: "Paper Insights", url: "paper-insights", icon: Lightbulb },
  { title: "Library", url: "library", icon: Library },
];

const ProjectSidebar = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const { handleSignout, isLoading: loadingSignout } = useSignout();
  const { width } = useDeviceSize();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth <= media.md;
      if (isMobile) return true;

      const savedState = localStorage.getItem("project-sidebar-collapsed");
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });

  // Force collapse if width <= media.md
  useEffect(() => {
    if (width <= media.md) {
      setIsCollapsed(true);
    }
  }, [width]);

  // Save to localStorage when state changes (only if width >= media.md)
  useEffect(() => {
    if (typeof window !== "undefined" && width > media.md) {
      localStorage.setItem(
        "project-sidebar-collapsed",
        JSON.stringify(isCollapsed)
      );
    }
  }, [isCollapsed, width]);

  const toggleCollapsed = () => {
    // Prevent manual toggle if width <= media.md
    if (width > media.md) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <aside className={classNames(s.container, isCollapsed && s.collapsed)}>
      <div className={s.header}>
        <Link className={s.logo} href={"/"}>
          <span>
            <Atom size={18} />
          </span>
          {!isCollapsed && <h4>DOSLR</h4>}
        </Link>

        <Button variant="icon" onClick={toggleCollapsed} className={s.toggle}>
          <span>
            <Layout size={18} />
          </span>
        </Button>
      </div>

      <nav>
        {projectLinks.map((pl) => {
          const isActive = pathname === `/project/${projectId}/${pl.url}`;
          const linkButton = (
            <LinkButton
              href={`/project/${projectId}/${pl.url}`}
              variant={isCollapsed ? "icon" : "icon_title"}
              key={pl.url}
              isActive={isActive}
            >
              <span>
                <pl.icon size={18} />
              </span>
              {!isCollapsed && pl.title}
            </LinkButton>
          );

          return isCollapsed ? (
            <Tooltip tooltip={pl.title} key={pl.title} right>
              {linkButton}
            </Tooltip>
          ) : (
            linkButton
          );
        })}
      </nav>

      <ul>
        <li>
          {isCollapsed ? (
            <Tooltip tooltip="My Projects" right>
              <LinkButton href={"/"} variant="icon">
                <span>
                  <Folder size={18} />
                </span>
              </LinkButton>
            </Tooltip>
          ) : (
            <LinkButton href={"/"} variant="icon_title">
              <span>
                <Folder size={18} />
              </span>
              My Projects
            </LinkButton>
          )}
        </li>
        <li>
          {isCollapsed ? (
            <Tooltip tooltip="My Account" right>
              <LinkButton href={"/account"} variant="icon">
                <span>
                  <User size={18} />
                </span>
              </LinkButton>
            </Tooltip>
          ) : (
            <LinkButton href={"/account"} variant="icon_title">
              <span>
                <User size={18} />
              </span>
              My Account
            </LinkButton>
          )}
        </li>
        <li>
          {isCollapsed ? (
            <Tooltip tooltip="Signout" right>
              <Button
                variant="icon"
                onClick={handleSignout}
                disabled={loadingSignout}
              >
                <span>
                  <LogOut size={18} />
                </span>
              </Button>
            </Tooltip>
          ) : (
            <Button
              variant="icon_title"
              onClick={handleSignout}
              disabled={loadingSignout}
            >
              <span>
                <LogOut size={18} />
              </span>
              Signout
            </Button>
          )}
        </li>
      </ul>
    </aside>
  );
};

export default ProjectSidebar;
