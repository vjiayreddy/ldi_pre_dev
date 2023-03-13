import React from "react";
import { Box, styled, Typography } from "@mui/material";
import Dropzone, { DropEvent, FileRejection } from "react-dropzone";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const StyledBoxContainer = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.divider}`,
  padding: 20,
  width: "100%",
  backgroundColor: theme.palette.grey[200],
}));

const StyledUploadSection = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
}));

interface UiDropZoneProps {
  onDrop:
    | (<T extends File>(
        acceptedFiles: T[],
        fileRejections: FileRejection[],
        event: DropEvent
      ) => void)
    | undefined;
}

const UiDropZone = ({ onDrop }: UiDropZoneProps) => {
  return (
    <Dropzone
      accept={{
        "text/csv": [".csv"],
      }}
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps }) => (
        <>
          <StyledBoxContainer>
            <StyledUploadSection
              {...getRootProps({
                accept: { "image/*": [] },
              })}
            >
              <input {...getInputProps()} />
              <FileUploadIcon />
              <Typography
                sx={{ fontSize: "12px", fontWeight: 800, marginTop: "10px" }}
                variant="body2"
              >
                Upload Mapping File Here
              </Typography>
            </StyledUploadSection>
          </StyledBoxContainer>
        </>
      )}
    </Dropzone>
  );
};

export default UiDropZone;
