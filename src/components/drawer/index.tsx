import React from "react";
import Drawer from "@mui/material/Drawer";

const drawerWidth = 240;

const SideDrawer = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    ></Drawer>
  );
};

export default SideDrawer;
