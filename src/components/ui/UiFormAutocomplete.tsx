import React from "react";
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  InputBase,
  InputLabel,
  styled,
} from "@mui/material";
import { Control, FieldValues, useController } from "react-hook-form";
import { FormHelperText } from "@mui/material";

export interface UiFormAutocompleteProps {
  id: string;
  label: string | null;
  labelTag?: string;
  options: any[];
  name: string;
  isRequired?: boolean;
  control: Control<FieldValues, object>;
  defaultValue?: any;
  rules?: any;
  fullWidth?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  filterSelectedOptions?: boolean;
  size?: "small" | "medium";
  [x: string]: any;
  targetValue?: string;
  onChangeAutoComplete?:
    | ((
        event: React.SyntheticEvent<Element, Event>,
        value: any,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<any> | undefined
      ) => void)
    | undefined;
}

const UiAutocompletedInputForm: React.FC<UiFormAutocompleteProps> = ({
  id,
  name,
  control,
  rules,
  label,
  options,
  defaultValue,
  isRequired,
  fullWidth,
  size,
  targetValue,
  disabled,
  multiple,
  filterSelectedOptions,
  isEqualValue,
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const StyledRequiredIndication = styled("span")(({ theme }) => ({
    color: theme.palette.error.main,
    marginLeft: theme.spacing(0.5),
  }));

  return (
    <>
      {label && (
        <InputLabel
          sx={{ fontSize: 13, fontWeight: 800, marginBottom: "10px" }}
        >
          {label}
          {isRequired && <StyledRequiredIndication>*</StyledRequiredIndication>}
        </InputLabel>
      )}
      <Autocomplete
        {...field}
        id={id}
        multiple={multiple}
        disabled={disabled}
        options={options}
        defaultValue={defaultValue}
        filterSelectedOptions={filterSelectedOptions}
        isOptionEqualToValue={(option, value) =>
          option[isEqualValue] === value[isEqualValue]
        }
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          if (targetValue) {
            return `${option[targetValue]}(${option["timezones"][0]})`;
          }
          return option.label || option[`${targetValue}`];
        }}
        onChange={(e, data) => {
          field.onChange(data);
        }}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, ...rest } = params;
          return (
            <InputBase
              {...params.InputProps}
              {...rest}
              fullWidth={fullWidth}
              size={size}
              error={fieldState.invalid ? true : false}
            />
          );
        }}
      />
      {fieldState.invalid && (
        <FormHelperText error>Please select Time Zone</FormHelperText>
      )}
    </>
  );
};

export default UiAutocompletedInputForm;
