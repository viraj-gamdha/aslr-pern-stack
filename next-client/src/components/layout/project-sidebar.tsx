"use client";

import s from "./project-sidebar.module.scss";
import {
  Atom,
  FilePenLine,
  FileSearch,
  Folder,
  Layout,
  LayoutIcon,
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

const otherLinks = [
  { title: "My Projects", url: "/", icon: Folder },
  { title: "My Account", url: "/account", icon: User },
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
            <LayoutIcon size={18} />
          </span>
        </Button>
      </div>

      <nav>
        {projectLinks.map((pl) => {
          const isActive = pathname === `/project/${projectId}/${pl.url}`;
          const linkButton = (
            <LinkButton
              href={`/project/${projectId}/${pl.url}`}
              variant="icon"
              key={pl.url}
              isActive={isActive}
              style={{ width: isCollapsed ? "fit-content" : "100%" }}
            >
              <span>
                <pl.icon size={18} />
              </span>
              {!isCollapsed && pl.title}
            </LinkButton>
          );

          return isCollapsed ? (
            <Tooltip tooltip={pl.title} key={pl.title} position="right">
              {linkButton}
            </Tooltip>
          ) : (
            linkButton
          );
        })}
      </nav>

      <ul>
        {otherLinks.map((link) => {
          return isCollapsed ? (
            <Tooltip key={link.url} tooltip={link.title} position="right">
              <LinkButton href={link.url} variant="icon">
                <span>
                  <link.icon size={18} />
                </span>
              </LinkButton>
            </Tooltip>
          ) : (
            <LinkButton
              key={link.url}
              href={link.url}
              variant="icon"
              style={{ width: "100%" }}
            >
              <span>
                <link.icon size={18} />
              </span>
              {link.title}
            </LinkButton>
          );
        })}

        <li>
          {isCollapsed ? (
            <Tooltip tooltip="Signout" position="right">
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
              variant="icon"
              onClick={handleSignout}
              disabled={loadingSignout}
              style={{ width: "100%" }}
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
