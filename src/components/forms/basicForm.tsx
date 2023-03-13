import { Card, CardContent, Grid } from "@mui/material";
import UiFormTextField from "../ui/UiTextField";
import { useForm } from "react-hook-form";

const BasicForm = () => {
  const { control } = useForm();
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <UiFormTextField
              size="small"
              control={control}
              id="INPUT_CUSTOMER_HOSPITAL"
              label="Customer / Hospital"
              name="cusHospital"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <UiFormTextField
              size="small"
              control={control}
              id="INPUT_FLOOR_NUMBER"
              label="Floor Number"
              name="floorNumber"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <UiFormTextField
              size="small"
              control={control}
              id="INPUT_RACK_NUMBER"
              label="Rack Number"
              name="rackNumber"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BasicForm;
