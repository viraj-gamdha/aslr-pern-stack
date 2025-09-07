// Define reference type
export interface Reference {
  id: string;
  authors: string;
  title: string;
  journal?: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
}

// Mock references data (to be replaced with API data)
export const mockReferences: Reference[] = [
  {
    id: "1",
    authors: "Smith, J., Johnson, A., & Williams, R.",
    title: "Advanced Research Methods",
    journal: "Journal of Scientific Research",
    year: 2023,
    volume: "15",
    pages: "112-125",
    doi: "10.1002/jsar.20230012",
  },
  {
    id: "2",
    authors: "Chen, L., & Kim, M.",
    title: "Modern Approaches to Data Analysis",
    journal: "Data Science Review",
    year: 2022,
    volume: "8",
    pages: "45-67",
    doi: "10.1016/j.dsr.2022.04.003",
  },
];

// utils/exportUtils.ts (additional function)
export const exportToPDFViaAPI = async (
  content: any,
  projectId: string
): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:4000/api/export/${projectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        format: "pdf",
        references: mockReferences,
      }),
    });

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("API export error:", error);
  }
};
