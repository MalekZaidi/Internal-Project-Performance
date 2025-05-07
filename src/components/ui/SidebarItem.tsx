// SidebarItem.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Box } from "@mui/material";
import { SidebarItemType } from "./sidebarConfig";

interface SidebarItemProps {
  item: SidebarItemType;
  collapsed: boolean;
  selectedPath: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, collapsed, selectedPath }) => {
  const isSelected =
  item.path === "/"
    ? selectedPath === "/"
    : selectedPath.startsWith(item.path);

  return (
    <ListItem disablePadding sx={{ position: "relative" }}>
      <Tooltip title={collapsed ? item.text : ""} placement="right">
        <NavLink
          to={item.path}
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          <ListItemButton
            sx={{
              py: 1.5,
              px: 2,
              mx: 1,
              borderRadius: "8px",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { 
                backgroundColor: "rgba(255, 230, 0, 0.1)",
                "& .sidebar-icon": {
                  transform: "scale(1.1)"
                }
              },
              ...(isSelected  && {
                backgroundColor: "rgba(255, 230, 0, 0.15) !important",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "3px",
                  bgcolor: "#ffe600",
                  borderRadius: "0 4px 4px 0"
                }
              })
            }}
          >
            <ListItemIcon
              sx={{
                color: isSelected  ? "#ffe600" : "rgba(255, 255, 255, 0.8)",
                minWidth: collapsed ? "auto" : 48,
                transition: "transform 0.2s ease",
                "& svg": {
                  fontSize: "1.5rem"
                }
              }}
              className="sidebar-icon"
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.text}
                sx={{ 
                  color: isSelected  ? "#ffe600" : "rgba(255, 255, 255, 0.9)",
                  "& span": {
                    fontWeight: isSelected  ? 600 : 500,
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em"
                  }
                }}
              />
            )}
          </ListItemButton>
        </NavLink>
      </Tooltip>
    </ListItem>
  );
};

export default SidebarItem;