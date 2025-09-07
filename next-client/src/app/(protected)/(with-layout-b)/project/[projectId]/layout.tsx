import ProjectSidebar from "@/components/layout/project-sidebar";
import TipTapEditorProvider from "@/providers/EditorProvider";

// project/:projectId/<tabs>
export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-b">
      <TipTapEditorProvider>
        <ProjectSidebar />
        <main className="layout-content-wrapper">{children}</main>
      </TipTapEditorProvider>
    </div>
  );
}
