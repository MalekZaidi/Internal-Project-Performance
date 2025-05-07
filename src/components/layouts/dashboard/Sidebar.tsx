// Sidebar.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Drawer, List, useTheme, useMediaQuery, IconButton, Box } from "@mui/material";
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
  const userRole = user?.role || "team_member";

  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location.pathname]);

  const accessibleMenuItems = useMemo(() => getAccessibleMenuItems(userRole), [userRole]);

  return (
    <Drawer
      ModalProps={{ keepMounted: true }}
      variant={isMobile ? "temporary" : "persistent"}
      open={isMobile ? isOpen : true}
      onClose={onClose}
      sx={{
        width: collapsed ? 72 : 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? 72 : 240,
          backgroundColor: "#333333",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          paddingTop: "64px",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          zIndex: 1200,
          "&:hover": {
            "& .sidebar-hover-effect": {
              opacity: 0.3
            }
          }
        },
      }}
    >
      {isMobile && (
        <IconButton
          onClick={onClose}
          sx={{ 
            position: "absolute", 
            top: 16, 
            right: 16, 
            color: "white",
            backgroundColor: "#333333",
            "&:hover": {
              backgroundColor: "#333333"
            }
          }}
        >
          <Close />
        </IconButton>
      )}

      <List sx={{ py: 1 }}>
        {accessibleMenuItems.map((item, index) => (
          <SidebarItem key={index} item={item} collapsed={collapsed} selectedPath={selectedPath} />
        ))}
      </List>
      
      {/* Subtle hover effect layer */}
      <Box
        className="sidebar-hover-effect"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `"#333333" `,
          opacity: 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
          zIndex: -1
        }}
      />
    </Drawer>
  );
};

export default Sidebar;