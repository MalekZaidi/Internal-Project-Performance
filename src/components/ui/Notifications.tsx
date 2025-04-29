import React from "react";
import { IconButton, Badge } from "@mui/material";
import { Notifications as NotificationsIcon, Settings as SettingsIcon } from "@mui/icons-material";

const Notifications: React.FC = () => {
  return (
    <>
      <IconButton color="inherit">
        <Badge badgeContent={4} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <IconButton color="inherit">
        <SettingsIcon />
      </IconButton>
    </>
  );
};

export default Notifications;
