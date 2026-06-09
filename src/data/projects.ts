import commercial from "@/assets/project-commercial.jpg";
import residential from "@/assets/project-residential.jpg";
import spider from "@/assets/project-spider.jpg";
import office from "@/assets/project-office.jpg";
import casement from "@/assets/project-casement.jpg";
import curtain from "@/assets/project-curtain.jpg";
import glassdoor from "@/assets/project-glassdoor.jpg";
import acp from "@/assets/project-acp.jpg";

export type ProjectCategory =
  | "Commercial"
  | "Residential"
  | "Showroom"
  | "Workspace"
  | "Facade"
  | "Retail";

export interface Project {
  id: string;
  img: string;
  title: string;
  category: ProjectCategory;
  location: string;
  scope: string;
  year: number;
}

export const defaultProjects: Project[] = [
  {
    id: "acp-hq",
    img: commercial,
    title: "ACP Facade — Corporate HQ",
    category: "Commercial",
    location: "Hubli",
    scope: "12,000 sq.ft ACP cladding with concealed fixing",
    year: 2024,
  },
  {
    id: "sliding-villa",
    img: residential,
    title: "Sliding Windows — Sky Villa",
    category: "Residential",
    location: "Bengaluru",
    scope: "Heavy-section sliding windows, 9 mm toughened glass",
    year: 2024,
  },
  {
    id: "spider-atrium",
    img: spider,
    title: "Spider Glazing — Atrium",
    category: "Showroom",
    location: "Mysuru",
    scope: "Triple-storey spider system with stainless fittings",
    year: 2023,
  },
  {
    id: "office-tech",
    img: office,
    title: "Office Partitions — Tech Park",
    category: "Workspace",
    location: "Mangalore",
    scope: "Double-glazed acoustic partitions, 220 cabins",
    year: 2024,
  },
  {
    id: "casement-villa",
    img: casement,
    title: "Casement Windows — Hillside Residence",
    category: "Residential",
    location: "Hassan",
    scope: "Thermal-break casement with mosquito mesh",
    year: 2023,
  },
  {
    id: "curtain-tower",
    img: curtain,
    title: "Unitised Curtain Wall — IT Tower",
    category: "Facade",
    location: "Bengaluru",
    scope: "18-floor unitised system, reflective DGU",
    year: 2025,
  },
  {
    id: "glassdoor-retail",
    img: glassdoor,
    title: "Frameless Glass Doors — Flagship Store",
    category: "Retail",
    location: "Hubli",
    scope: "12 mm frameless toughened doors with patch fittings",
    year: 2024,
  },
  {
    id: "acp-mall",
    img: acp,
    title: "ACP & Glazing — City Mall",
    category: "Facade",
    location: "Mysuru",
    scope: "Mixed ACP + structural glazing facade",
    year: 2025,
  },
];

export const projects = defaultProjects;

const LOCAL_STORAGE_KEY = "arm_edifice_custom_projects";

export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") return defaultProjects;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProjects));
    return defaultProjects;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultProjects;
  }
}

export function saveStoredProjects(projectsList: Project[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projectsList));
}

export function addStoredProject(project: Omit<Project, "id">): Project {
  const list = getStoredProjects();
  const newProject: Project = {
    ...project,
    id: `project-${Date.now()}`,
  };
  list.push(newProject);
  saveStoredProjects(list);
  return newProject;
}

export function updateStoredProject(project: Project) {
  const list = getStoredProjects();
  const index = list.findIndex((p) => p.id === project.id);
  if (index !== -1) {
    list[index] = project;
    saveStoredProjects(list);
  }
}

export function deleteStoredProject(id: string) {
  const list = getStoredProjects();
  const filtered = list.filter((p) => p.id !== id);
  saveStoredProjects(filtered);
}

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "Commercial",
  "Residential",
  "Facade",
  "Showroom",
  "Workspace",
  "Retail",
];
