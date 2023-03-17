import { InputBaseProps } from "@mui/material/InputBase";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";

import FormHelperText from "@mui/material/FormHelperText";
import { Control, FieldValues, useController } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import { styled, SxProps } from "@mui/material";
// or

const StyledRequiredIndication = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: theme.spacing(0.5),
}));
const StyledInpuLabel = styled(InputLabel)(({ theme }) => ({
  fontWeight: 900,
  fontSize: 12,
}));

export interface UiFormTextFieldProps extends InputBaseProps {
  id: string;
  label?: string;
  name: string;
  control?: Control<FieldValues, object>;
  rules?: any;
  defaultValue?: string;
  hintMessage?: string;
  fieldType?: string;
  iconSx?: SxProps;
  isRequired?: boolean;
}

export interface UiFormTextFieldProps extends InputBaseProps {
  id: string;
  label?: string;
  name: string;
  control?: Control<FieldValues, object>;
  rules?: any;
  defaultValue?: string;
  hintMessage?: string;
  fieldType?: string;
  iconSx?: SxProps;
  isRequired?: boolean;
}

const UiFormTextField = ({
  id,
  name,
  control,
  rules,
  defaultValue,
  hintMessage,
  fieldType,
  label,
  iconSx,
  isRequired,
  ...props
}: UiFormTextFieldProps) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  return (
    <>
      {label && (
        <Box mb={1}>
          <StyledInpuLabel>
            {label}
            {isRequired && (
              <StyledRequiredIndication>*</StyledRequiredIndication>
            )}
          </StyledInpuLabel>
        </Box>
      )}
      <InputBase
        fullWidth
        id={id}
        error={fieldState.invalid ? true : false}
        type={fieldType}
        {...field}
        {...props}
      />
      {hintMessage && !fieldState.error && (
        <FormHelperText sx={{ fontSize: "10px", fontWeight: 800 }}>
          {hintMessage}
        </FormHelperText>
      )}
      {fieldState.invalid && (
        <FormHelperText
          sx={{ fontSize: "10px", fontWeight: 800 }}
          error={fieldState.invalid}
          id={`${id}-error`}
        >
          {fieldState.error?.message}
        </FormHelperText>
      )}
    </>
  );
};

export default UiFormTextField;
