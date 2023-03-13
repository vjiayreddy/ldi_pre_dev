import { createTheme } from "@mui/material";
import { COLORS } from "./colors";
const defaultTheme = createTheme({
  spacing: 10,
});
export const theme = createTheme({
  components: {
    MuiAppBar: {
      defaultProps: {
        position: "static",
        elevation: 0,
      },
      styleOverrides: {
        positionStatic: {
          backgroundColor: COLORS.white,
          borderBottom: `1px solid ${COLORS.border}`,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: 11,
          fontWeight: "bold",
          padding: 5,
          borderLeft: "1px solid rgba(224, 224, 224, 1)",
          borderTop: "1px solid rgba(224, 224, 224, 1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        sizeSmall: {
          textTransform: "none",
          borderRadius: 5,
          minWidth: 75,
        },
      },
    },
    MuiTab:{
     styleOverrides:{
      root:{
        textTransform:"none"
      }
     }
    },
    MuiInputBase: {
      defaultProps: {
        size: "medium",
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid rgba(224, 224, 224, 1)`,
          "&.Mui-focused": {
           // border: `1px solid ${APP_COLORS.ROOT_DIVIDER_COLOR}`,
          },
          "&.Mui-error": {
           // border: `1px solid ${defaultTheme.palette.error.main}`,
          },
          backgroundColor: defaultTheme.palette.common.white,
        },
        input: {
          padding: defaultTheme.spacing(1),
          fontWeight: 500,
          fontSize: defaultTheme.spacing(1.4),
        },
        inputSizeSmall: {
          padding: defaultTheme.spacing(0.8),
          height: defaultTheme.spacing(1.5),
          fontSize: defaultTheme.spacing(1.3),
        },
      },
    },
  },
});
