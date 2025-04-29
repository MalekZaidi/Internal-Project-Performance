import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Drawer, List, useTheme, useMediaQuery, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import SidebarItem from "../../ui/SidebarItem";
import { menuItems, additionalItems, getAccessibleMenuItems } from "../../ui/sidebarConfig";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/store";
interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onClose, isOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(location.pathname);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role || "team_member"; // Default to lowest permission role

  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location.pathname]);

  // Filter menu items based on user role
  const accessibleMenuItems = useMemo(() => getAccessibleMenuItems(userRole), [userRole]);

  return (
    <Drawer
      ModalProps={{ keepMounted: true }}
      variant={isMobile ? "temporary" : "persistent"}
      open={isMobile ? isOpen : true}
      onClose={onClose}
      sx={{
        width: collapsed ? 55 : 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? 55 : 220,
          boxSizing: "border-box",
          backgroundColor: "#333333",
          color: "white",
          paddingTop: "64px",
          transition: "width 0.3s",
          fontFamily: "Roboto, sans-serif",
          overflowX: "hidden",
          zIndex: 1200,
        },
      }}
    >
      {isMobile && (
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10, color: "white" }}
        >
          <Close />
        </IconButton>
      )}

      <List>
        {accessibleMenuItems.map((item, index) => (
          <SidebarItem key={index} item={item} collapsed={collapsed} selectedPath={selectedPath} />
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
