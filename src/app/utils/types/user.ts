import { UserRoles } from "../constants";
import { Project } from "./project";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRoles;
  created_at: string;
  projects: Project[];
}
