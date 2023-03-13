import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Typography from "@mui/material/Typography";

const StyledMainBoxWrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
}));

const StyledLoginFormWrapper = styled(Box)(({ theme }) => ({
  width: "25%",
  textAlign: "center",
}));

const LoginPage = () => {
  const { control, handleSubmit, formState } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  console.log(formState.errors);

  return (
    <StyledMainBoxWrapper>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <StyledLoginFormWrapper>
          <Box mb={2}>
            <Typography gutterBottom align="center" variant="h4">
              Hello Login
            </Typography>
            <Typography
              style={{ textAlign: "center" }}
              align="center"
              variant="caption"
            >
              Mobile App I am working on. I hope you enjoyed it! Thanks for your
              likes and comments!
            </Typography>
          </Box>
          <Box>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  helperText=" "
                  id="demo-helper-text-aligned-no-helper"
                  label="Email Address"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  helperText=" "
                  id="password-input"
                  label="Password"
                  type={"password"}
                />
              )}
            />
            <Button
              onClick={handleSubmit(onSubmit)}
              size="large"
              disableElevation
              variant="contained"
              fullWidth
            >
              Login
            </Button>
          </Box>
        </StyledLoginFormWrapper>
      </Grid>
    </StyledMainBoxWrapper>
  );
};

export default LoginPage;
