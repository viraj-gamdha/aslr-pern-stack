import ProjectSidebar from "@/components/layout/project-sidebar";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-b">
      <ProjectSidebar />
      <main className="layout-content-wrapper">{children}</main>
    </div>
  );
}
