import { Home, Assignment, MonetizationOn, Group, Warning, Assessment, AccountCircle } from "@mui/icons-material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { JSX } from "react";

export interface SidebarItemType {
  text: string;
  icon: JSX.Element;
  path: string;
  roles: string[]; // Roles that can access this item
}

export const menuItems: SidebarItemType[] = [
  { text: "Dashboard", icon: <Home />, path: "/", roles: ["admin", "project_manager", "team_member"] },
  { text: "Users", icon: <ManageAccountsIcon />, path: "/users", roles: ["admin"] },
  { text: "Projects", icon: <Assignment />, path: "/projects", roles: ["admin", "project_manager", "team_member"] },
  { text: "Budgets", icon: <MonetizationOn />, path: "/budgets", roles: ["admin", "project_manager"] },
  { text: "Resources", icon: <Group />, path: "/resources", roles: ["admin", "project_manager", "team_member"] },
  { text: "Risk Management", icon: <Warning />, path: "/risk-management", roles: ["admin", "project_manager"] },
  { text: "Reports", icon: <Assessment />, path: "/reports", roles: ["admin", "project_manager", "team_member"] },
];

export const additionalItems: SidebarItemType[] = [
  { text: "Account", icon: <AccountCircle />, path: "/account", roles: ["admin", "project_manager", "team_member"] },
];

/**
 * Get menu items accessible by a specific role
 */
export const getAccessibleMenuItems = (role: string): SidebarItemType[] => {
  return [...menuItems, ...additionalItems].filter(item => item.roles.includes(role));
};
