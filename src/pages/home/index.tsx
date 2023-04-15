import { useCallback, useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import {
  Box,
  styled,
  Grid,
  Container,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  CardActions,
  Typography,
  Divider,
  Dialog,
  InputLabel,
  FormControlLabel,
  Radio,
  AppBar,
  Toolbar,
  IconButton,
  RadioGroup,
} from "@mui/material";
import UiFormTextField from "../../components/ui/UiTextField";
import { useForm, Controller } from "react-hook-form";
import React from "react";
import {
  countries,
  createTackTags,
  createShelfLeftTag,
  createShelfRightTag,
  sectionTabs,
  convertCsvFileToJson,
  generateBinTags,
  alphabeticallyOrder,
} from "../../utils";
import CloseIcon from "@mui/icons-material/Close";
import { getApiData, postData, postApiData } from "../../apiService";
import UiDropZone from "../../components/ui/UiDropZone";
import { _dataMapping } from "../../utils/binMapping";
import UiAutocompletedInputForm from "../../components/ui/UiFormAutocomplete";

const localUrl = "http://192.168.192.120:8081";
const selfUrl = "";
const baseUrl = selfUrl;
const postUrl = "/updateConfig";
const updateItemMapping = "/updateItemMapping";

const headers = [
  { label: "MV Tag Id", key: "tagId" },
  { label: "Bin Serial", key: "binId" },
  { label: "Name", key: "productName" },
];

const StyledHeadingBox = styled(Box)(({ theme }) => ({
  padding: 20,
  fontWeight: "bold",
  backgroundColor: "#1565c0",
  color: "white",
  marginBottom: 30,
}));

const DashboardPage = () => {
  const componentRef = useRef<any>();
  const [isDownloadMapping, setIsDownloadMapping] = useState<boolean>(false);
  const [isDownloadTags, setIsDownloadTags] = useState<boolean>(true);
  const { control, handleSubmit, reset, register, getValues, watch } =
    useForm();
  const [rackTags, setRackTags] = React.useState<any>(null);
  const [file, setFile] = React.useState<any>(null);
  const [cvs, setCvs] = React.useState<any>([]);
  const [extractedCSVData, setExtractedCSVData] = useState<any[]>([]);
  const [_leftSelfTag, setleftSelfTag] = React.useState<any>(null);
  const [_rightSelfTag, setRightSelfTag] = React.useState<any>(null);
  const [_binTags, setBinTags] = React.useState<any[]>([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [config, setConfig] = React.useState<any>(null);
  const [mapping, setMapping] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showMOdel, setShowModel] = React.useState<boolean>(false);
  const watchBinTags = watch(["binTagStartRange", "binTagEndRange"]);

  useEffect(() => {
    getApiData(`${baseUrl}/getConfig`, setConfig, setIsLoading);
    getApiData(`${baseUrl}/getItemMapping`, setMapping, setIsDownloadTags);
  }, []);

  useEffect(() => {
    if (config) {
      if (config?.timezone) {
        const _findTimeZone = countries.find(
          (item) => item?.timezones[0] === config?.timezone
        );
        if (_findTimeZone) {
          reset({ ...config, timezone: _findTimeZone });
        } else {
          reset(config);
        }
      }
    }
  }, [config]);

  useEffect(() => {
    if (watchBinTags) {
      const getFormValues = getValues();
      if (
        getFormValues?.binTagStartRange &&
        Number(getFormValues?.binTagStartRange) >= 0 &&
        Number(getFormValues?.binTagEndRange) >
          Number(getFormValues?.binTagStartRange)
      ) {
        setIsDownloadMapping(true);
      } else {
        setIsDownloadMapping(false);
      }
    }
  }, [watchBinTags]);

  const generateTagsCount = (watchBinTags: any) => {
    let tagsData: any = [];
    const binTagStartRange = watchBinTags[0] ? Number(watchBinTags[0]) : 0;
    const binTagEndRange = watchBinTags[1] ? Number(watchBinTags[1]) : 0;
    if (binTagStartRange >= 0 && binTagEndRange > binTagStartRange) {
      for (let i = binTagStartRange; i < binTagEndRange; i++) {
        let payload = {};
        if (mapping) {
          //const { binMapping } = mapping;
          const { binMapping } = mapping;
          const binData: any[] = binMapping;
          const _findMappingItem = binData.find(
            (item: any) => item.tagId === i
          );
          if (_findMappingItem) {
            payload = _findMappingItem;
          } else {
            payload = {
              tagId: i,
              binId: "",
              productName: "",
            };
          }
        } else {
          payload = {
            tagId: i,
            binId: "",
            productName: "",
          };
        }
        tagsData.push(payload);
      }
    }
    return setCvs(tagsData);
  };

  const onSubmit = (data: any) => {
    const payload = {
      flipCamera: data.flipCamera === "true" ? true : false,
      rackNo: data.rackNo,
      sendDataEveryMinute: Number(data.sendDataEveryMinute),
      sendDataEveryHour: Number(data.sendDataEveryHour),
      name: data.name,
      floorNo: Number(data.floorNo),
      roomNo: Number(data?.roomNo),
      rackTag: Number(data?.rackTag),
      leftShelfTag: Number(data?.leftShelfTag),
      rightShelfTag: Number(data?.rightShelfTag),
      binTagStartRange: Number(data?.binTagStartRange),
      binTagEndRange: Number(data?.binTagEndRange),
      sendDataToServer: data?.sendDataToServer === "true" ? true : false,
      useImageStabilization:
        data?.useImageStabilization === "true" ? true : false,
      timezone: data?.timezone,
    };
    postApiData(`${baseUrl}${postUrl}`, payload)
      .then((res) => {
        alert("Saved Successfully");
      })
      .catch((error) => {});
    if (extractedCSVData?.length > 0) {
      postApiData(`${baseUrl}${updateItemMapping}`, extractedCSVData).then(
        (res) => {
          getApiData(
            `${baseUrl}/getItemMapping`,
            setMapping,
            setIsDownloadTags
          );
        }
      );
    }
  };

  const onGetFormValues = () => {
    const payload = getValues();
    const { rackTag, leftShelfTag, rightShelfTag } = payload;
    createTackTags(rackTag, setRackTags);
    createShelfLeftTag(leftShelfTag, setleftSelfTag);
    createShelfRightTag(rightShelfTag, setRightSelfTag);
    generateBinTags(mapping?.binMapping, setBinTags);
    setShowModel(true);
  };

  return (
    <>
      <StyledHeadingBox>
        <Typography variant="h6" align="center">
          LDI PRE DEVELOPMENT CONFIGURATIONS
        </Typography>
      </StyledHeadingBox>
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <UiFormTextField
                  size="small"
                  control={control}
                  defaultValue=""
                  isRequired={true}
                  id="INPUT_CUSTOMER_HOSPITAL"
                  label="Customer / Hospital"
                  name="name"
                  rules={{ required: "Customer / Hospital is required" }}
                />
              </Grid>
              <Grid item xs={6}>
                <UiFormTextField
                  size="small"
                  control={control}
                  defaultValue=""
                  id="INPUT_ROOM_NO"
                  label="Room No"
                  name="roomNo"
                  isRequired={true}
                  rules={{ required: "Room number is required" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <UiFormTextField
                  size="small"
                  control={control}
                  defaultValue=""
                  id="INPUT_FLOOR_NUMBER"
                  label="Floor Number"
                  name="floorNo"
                  rules={{ required: "Floor Number is required" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <UiFormTextField
                  size="small"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Rack Number is required" }}
                  id="INPUT_RACK_NUMBER"
                  label="Rack Number"
                  name="rackNo"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box mt={2} mb={2}>
          <Tabs
            onChange={(e, value) => {
              setTabIndex(value);
            }}
            value={tabIndex}
            aria-label="basic tabs example"
          >
            {sectionTabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Box>

        <Card>
          <CardContent>
            {tabIndex === 0 && (
              <>
                <Box mb={3}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm>
                      <Typography sx={{ fontWeight: 900 }} variant="body2">
                        Enter The Details to setup for 2 bin system
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button size="small" variant="contained">
                        HOW TO SETUP
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Box mb={2}>
                  <Divider />
                </Box>

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                    <UiFormTextField
                      size="small"
                      control={control}
                      defaultValue=""
                      fieldType="number"
                      id="INPUT_RACK_TAGS"
                      label="Rack Tags(1-586)"
                      name="rackTag"
                      isRequired={true}
                      hintMessage="1 to 586"
                      rules={{
                        required: "Rack tag is required",
                        validate: (value: string) => {
                          if (Number(value) <= 0) {
                            return "Rack tag must be grater then 0";
                          }
                          if (Number(value) > 586) {
                            return "Rack tag must be below 586";
                          }
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                    <UiFormTextField
                      size="small"
                      control={control}
                      fieldType="number"
                      defaultValue=""
                      id="INPUT_SELF_MARKET_TAG_LEFT"
                      label="Shelf/Marker Tag Left"
                      name="leftShelfTag"
                      hintMessage="1 to 17"
                      isRequired={true}
                      rules={{
                        required: "Shelf/Marker left tag is required",
                        validate: (value: string) => {
                          const selfMarkerTagRight = getValues("rightShelfTag");
                          if (Number(value) < 0) {
                            return "Shelf/Marker left tag  must be grater then 0";
                          } else if (Number(value) > 17) {
                            return "Shelf/Marker left tag  should not grater then 17";
                          } else if (Number(value) >= selfMarkerTagRight) {
                            return "Shelf/Marker left  tag  should not grater then right tag";
                          }
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                    <UiFormTextField
                      size="small"
                      control={control}
                      fieldType="number"
                      defaultValue=""
                      id="INPUT_SELF_MARKET_TAG_RIGHT"
                      label="Shelf/Marker Tag Right"
                      name="rightShelfTag"
                      hintMessage="18 to 34"
                      isRequired={true}
                      rules={{
                        required: "Shelf/Marker right tag  is required",
                        validate: (value: string) => {
                          const selfMarkerTagLeft = getValues("leftShelfTag");
                          if (Number(value) < 18) {
                            return "Shelf/Marker right tag  must be grater then 17";
                          } else if (Number(value) > 34) {
                            return "Shelf/Marker right tag  should not grater then 34";
                          } else if (Number(value) <= selfMarkerTagLeft) {
                            return "Shelf/Marker right tag  should not less then left tag";
                          }
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                    <UiFormTextField
                      size="small"
                      fieldType="number"
                      control={control}
                      defaultValue=""
                      isRequired={true}
                      id="INPUT_BIN_TAGS_MIX"
                      label="MV Tags ( Min)"
                      name="binTagStartRange"
                      hintMessage="0 to 23999"
                      rules={{
                        required: "Min Mv Tag is required",
                        validate: (value: string) => {
                          const getMVtagMaxValue = getValues("binTagEndRange");
                          if (Number(value) > 23999) {
                            return "Min Mv Tag should not graterthen 23999";
                          } else if (
                            Number(value) >= Number(getMVtagMaxValue)
                          ) {
                            return "Min Mv Tag should not graterthen Max MV Tag";
                          }
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                    <UiFormTextField
                      size="small"
                      fieldType="number"
                      control={control}
                      defaultValue=""
                      id="INPUT_BIN_TAGS_MAX"
                      isRequired={true}
                      label="MV Tags ( Max)"
                      name="binTagEndRange"
                      hintMessage="0 to 24000"
                      rules={{
                        required: "Max Mv Tag is required",
                        validate: (value: string) => {
                          const getMVtagMinValue =
                            getValues("binTagStartRange");
                          if (Number(value) > 24000) {
                            return "Max Mv Tag should not graterthen 24000";
                          } else if (
                            Number(value) <= Number(getMVtagMinValue)
                          ) {
                            return "Max Mv Tag should not less then Min MV Tag";
                          }
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <Box mt={2}></Box>
                <Divider />

                <Box mt={2}>
                  <Typography sx={{ fontWeight: 900 }} variant="body2">
                    Map MV Tags To Bin Items
                  </Typography>
                  <Typography variant="caption">
                    Note: Download the file xlsx and update and upload the
                    mapping file
                  </Typography>
                </Box>
                <Box mt={2}>
                  <CardActions sx={{ paddingLeft: 0 }}>
                    {isDownloadMapping ? (
                      <CSVLink
                        headers={headers}
                        data={cvs}
                        onClick={() => {
                          generateTagsCount(watchBinTags);
                        }}
                        filename="mappingFile.csv"
                      >
                        Download Mapping File
                      </CSVLink>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          textAlign: "center",
                          textDecoration: "none",
                          fontSize: "12px",
                          height: "30px",
                          fontWeight: "500",
                          padding: "6px",
                          borderRadius: "5px !important",
                        }}
                        disabled={true}
                      >
                        Download Mapping File
                      </Button>
                    )}

                    <Button
                      disabled={mapping?.binMapping.length > 0 ? false : true}
                      disableElevation
                      onClick={onGetFormValues}
                      color="warning"
                      variant="contained"
                      size="small"
                    >
                      Download Tags
                    </Button>
                  </CardActions>
                </Box>
                <Box mt={2}>
                  <CardActions sx={{ paddingLeft: 0 }}>
                    <UiDropZone
                      onDrop={(acceptedFiles) => {
                        setFile(acceptedFiles[0]);
                        convertCsvFileToJson(
                          acceptedFiles,
                          setExtractedCSVData,
                          mapping?.binMapping
                        );
                      }}
                    />
                  </CardActions>
                  {file && (
                    <>
                      <Box
                        pr={1}
                        sx={{ width: "100%" }}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                          }}
                        >
                          Selected File
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: "#039BE5",
                            textDecoration: "underLine",
                          }}
                        >
                          {file?.name}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </>
            )}
            {(tabIndex === 1 || tabIndex === 2) && (
              <Box p={2}>
                <Typography align="center">Coming Soon</Typography>
              </Box>
            )}
            {tabIndex === 3 && (
              <>
                <Box mb={2}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm>
                      <Typography sx={{ fontWeight: 900 }} variant="body2">
                        Default Setting For the Camera
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button size="small" variant="contained">
                        HOW TO SETUP
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center">
                    <Grid mb={1} item xs={12}>
                      <UiAutocompletedInputForm
                        targetValue="name"
                        defaultValue={{
                          timezones: ["America/New_York"],
                          code: "US",
                          continent: "North America",
                          name: "United States",
                          capital: "Washington, D.C.",
                        }}
                        label="Time Zone"
                        options={alphabeticallyOrder(countries)}
                        control={control}
                        id="time-zone"
                        name="timezone"
                      />
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center" item xs={12}>
                    <Grid item xs={12} md={8} sm={8} lg={8} xl={8}>
                      <InputLabel
                        sx={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: "#212121",
                        }}
                      >
                        Post Data To Server
                      </InputLabel>
                    </Grid>
                    <Grid item xs={4} md={4} sm={4} lg={4} xl={4}>
                      <Controller
                        rules={{ required: false }}
                        control={control}
                        defaultValue={true}
                        name="sendDataToServer"
                        render={({
                          field: { name, onBlur, onChange, value },
                        }) => (
                          <RadioGroup
                            row
                            value={value}
                            onBlur={onBlur}
                            name={name}
                            onChange={(e) => {
                              onChange(e);
                            }}
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center" item xs={12}>
                    <Grid item xs={12} md={8} sm={8} lg={8} xl={8}>
                      <InputLabel
                        sx={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: "#212121",
                        }}
                      >
                        Flip Camera
                      </InputLabel>
                    </Grid>
                    <Grid item xs={4} md={4} sm={4} lg={4} xl={4}>
                      <Controller
                        rules={{ required: false }}
                        control={control}
                        defaultValue={false}
                        name="flipCamera"
                        render={({
                          field: { name, onBlur, onChange, value },
                        }) => (
                          <RadioGroup
                            row
                            value={value}
                            onBlur={onBlur}
                            name={name}
                            onChange={(e) => {
                              onChange(e);
                            }}
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="True"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="False"
                            />
                          </RadioGroup>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center">
                    <Grid item xs={12} md={8} sm={8} lg={8} xl={8}>
                      <InputLabel
                        sx={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: "#212121",
                        }}
                      >
                        Image Stabilization
                      </InputLabel>
                    </Grid>
                    <Grid item xs={4} md={4} sm={4} lg={4} xl={4}>
                      <Controller
                        rules={{ required: false }}
                        control={control}
                        defaultValue={false}
                        name="useImageStabilization"
                        render={({
                          field: { name, onBlur, onChange, value },
                        }) => (
                          <RadioGroup
                            row
                            value={value}
                            onBlur={onBlur}
                            name={name}
                            onChange={(e) => {
                              onChange(e);
                            }}
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <InputLabel
                        sx={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: "rgba(0, 0, 0, 0.6)",
                        }}
                      >
                        Send Data Time Settings(H:M)
                      </InputLabel>
                    </Grid>

                    <Grid item>
                      <select {...register("sendDataEveryHour")}>
                        {Array.from({ length: 12 }, (_, i) => i).map(
                          (item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          )
                        )}
                      </select>
                    </Grid>
                    <Grid item>:</Grid>
                    <Grid item>
                      <select {...register("sendDataEveryMinute")}>
                        {Array.from({ length: 61 }, (_, i) => i).map(
                          (item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          )
                        )}
                      </select>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
        {(tabIndex === 0 || tabIndex === 3) && (
          <Box mt={3}>
            <CardActions sx={{ paddingLeft: 0, paddingTop: "0px" }}>
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                size="small"
              >
                Submit
              </Button>
            </CardActions>
          </Box>
        )}
      </Container>
      <Dialog
        fullScreen
        open={showMOdel}
        onClose={() => {
          setShowModel(false);
        }}
      >
        <AppBar color="secondary" sx={{ position: "relative" }}>
          <Toolbar sx={{ backgroundColor: "#212121" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setShowModel(false);
              }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Tags
            </Typography>
            <ReactToPrint
              trigger={() => {
                return (
                  <Button autoFocus color="inherit">
                    Print
                  </Button>
                );
              }}
              content={() => componentRef?.current}
            />
          </Toolbar>
        </AppBar>
        <>
          <Box p={2} ref={componentRef}>
            <Box>
              <p>
                INSTRUCTIONS : Below are the RACK & SHELF TAGS please cut them
                and Stick to the rack
              </p>
              <Grid container>
                <Grid
                  container
                  flexDirection="column"
                  alignItems="center"
                  item
                  md={4}
                  lg={2}
                >
                  <img src={rackTags} alt="rack-tag" />
                  <Box mb={1}>
                    <Typography sx={{ color: "#212121" }} variant="subtitle1">
                      Rack Tag
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  container
                  flexDirection="column"
                  alignItems="center"
                  item
                  md={4}
                  lg={4}
                >
                  <img src={_leftSelfTag} alt="left-shelf-tag" />
                  <Box mb={1}>
                    <Typography sx={{ color: "#212121" }} variant="subtitle1">
                      Left Shelf Tag
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  container
                  flexDirection="column"
                  alignItems="center"
                  item
                  md={4}
                  lg={4}
                >
                  <img src={_rightSelfTag} alt="left-shelf-tag" />
                  <Box mb={1}>
                    <Typography sx={{ color: "#212121" }} variant="subtitle1">
                      Right Shelf Tag
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box mt={2} mb={2}>
              <Typography>MV Tags</Typography>
            </Box>
            <Divider />
            <Box p={1} mt={1}>
              <Grid container alignItems="stretch" spacing={1}>
                {_binTags.map((item: any, index) => (
                  <Grid key={index} item md={4}>
                    <Box
                      p={1}
                      sx={{ border: "1px solid gray", height: "100%" }}
                    >
                      <Grid spacing={0} container alignItems="center">
                        <Grid
                          pl={1}
                          sx={{ borderRight: "1px solid gray" }}
                          item
                          md={6}
                        >
                          <Typography
                            fontWeight="900"
                            variant="h5"
                            align="center"
                          >
                            {item?.binId?.length > 0
                              ? item?.binId.slice(-1)
                              : "-"}
                          </Typography>
                          <Typography
                            fontSize="11px"
                            display="block"
                            textAlign="center"
                            variant="caption"
                          >
                            <b>No:{item?.binId}</b>
                          </Typography>
                          <Typography
                            fontSize="11px"
                            display="block"
                            textAlign="center"
                            variant="caption"
                          >
                            <b>
                              Name:
                              {item?.productName}
                            </b>
                          </Typography>
                          <Typography
                            fontSize="11px"
                            display="block"
                            textAlign="center"
                            variant="caption"
                          >
                            <b>
                              MV TAG ID:
                              {item?.tagId}
                            </b>
                          </Typography>
                        </Grid>
                        <Grid textAlign="center" item md={6}>
                          <img src={item?.imageurl} alt="left-shelf-tag" />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </>
      </Dialog>
    </>
  );
};

export default DashboardPage;
