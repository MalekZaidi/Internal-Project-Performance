import React from "react";
import { NavLink } from "react-router-dom";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { SidebarItemType } from "./sidebarConfig";

interface SidebarItemProps {
  item: SidebarItemType;
  collapsed: boolean;
  selectedPath: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, collapsed, selectedPath }) => {
  return (
    <ListItem disablePadding>
      <Tooltip title={collapsed ? item.text : ""} placement="right">
        <NavLink
          to={item.path}
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          <ListItemButton
            sx={{
              py: 2,
              px: 1.5,
              "&:hover": { backgroundColor: "#ffe600", color: "#333333" },
              borderLeft: item.path === selectedPath ? `4px solid #ffe600` : "none",
              color: item.path === selectedPath ? "#ffe600" : "inherit",
            }}
          >
            <ListItemIcon
              sx={{
                color: item.path === selectedPath ? "#ffe600" : "white",
                minWidth: collapsed ? "auto" : 56,
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.text}
                sx={{ color: item.path === selectedPath ? "#ffe600" : "white" }}
              />
            )}
          </ListItemButton>
        </NavLink>
      </Tooltip>
    </ListItem>
  );
};

export default SidebarItem;
