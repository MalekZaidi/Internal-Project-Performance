import React from "react";
import { Drawer, List, ListItem, Typography, Divider } from "@mui/material";
import ProjectSelector from "./ProjectSelector";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import { ExitToApp } from "@mui/icons-material";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ "& .MuiDrawer-paper": { backgroundColor: "#333", color: "white" } }}>
      <List sx={{ width: 250 }}>
        <Divider />
        <ListItem>
          <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
            Internal Project Performance
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ProjectSelector />
        </ListItem>
        <Divider />
        <ListItem>
          <SearchBar />
        </ListItem>
        <Divider />
        <ListItem>
          <Notifications />
        </ListItem>
        <Divider/>
        <ListItem>
        <ExitToApp sx={{  color: 'white' }} />
          <Typography sx={{ color: 'white' }}>Logout</Typography>      
        </ListItem>


      </List>
    </Drawer>
  );
};

export default MobileDrawer;
