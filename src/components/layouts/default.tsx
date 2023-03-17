import React from "react";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Logo from "../../cardinal.png";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const StyledMainRootContainer = styled(Container)(({ theme }) => ({
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  paddingBottom:50,
  backgroundColor: "#FAFAFA",
  minHeight: `calc(100vh - 65px)`,
  [theme.breakpoints.down("sm")]: {
    minHeight: `calc(100vh - 57px)`,
  },
}));

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img alt="logo" width={150} src={Logo} />
          </Toolbar>
        </Container>
      </AppBar>
      <StyledMainRootContainer disableGutters maxWidth="xl">
        {children}
      </StyledMainRootContainer>
    </React.Fragment>
  );
};

export default DefaultLayout;
