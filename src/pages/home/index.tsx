import { useCallback, useEffect, useRef } from "react";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
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
  createBinTags,
  sectionTabs,
} from "../../utils";
import CloseIcon from "@mui/icons-material/Close";
import { getApiData, postData } from "../../apiService";
import UiDropZone from "../../components/ui/UiDropZone";

const baseUrl = "http://192.168.192.120:8081";
const postUrl = "/updateConfig";

const DashboardPage = () => {
  const componentRef = useRef<any>();

  const { control, handleSubmit, reset, register, getValues, watch } =
    useForm();
  const [rackTags, setRackTags] = React.useState<any>(null);
  const [file, setFile] = React.useState<any>(null);
  const [cvs, setCvs] = React.useState<any>([]);
  const [_leftSelfTag, setleftSelfTag] = React.useState<any>(null);
  const [_rightSelfTag, setRightSelfTag] = React.useState<any>(null);
  const [_binTags, setBinTags] = React.useState<any[]>([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [config, setConfig] = React.useState(null);
  const [mapping, setMapping] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showMOdel, setShowModel] = React.useState<boolean>(false);
  const watchBinTags = watch(["binTagStartRange", "binTagEndRange"]);

  const StyledHeadingBox = styled(Box)(({ theme }) => ({
    padding: 20,
    fontWeight: "bold",
    backgroundColor: "#1565c0",
    color: "white",
    marginBottom: 30,
  }));

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
    postData(`${baseUrl}${postUrl}`, payload);
  };

  const onGetFormValues = () => {
    const payload = getValues();
    const {
      rackTag,
      leftShelfTag,
      rightShelfTag,
      binTagStartRange,
      binTagEndRange,
    } = payload;
    createTackTags(rackTag, setRackTags);
    createShelfLeftTag(leftShelfTag, setleftSelfTag);
    createShelfRightTag(rightShelfTag, setRightSelfTag);
    createBinTags(
      binTagStartRange,
      binTagEndRange,
      setBinTags,
      mapping?.binMapping
    );
    setShowModel(true);
  };

  useEffect(() => {
    getApiData(`${baseUrl}/getConfig`, setConfig, setIsLoading);
    getApiData(`${baseUrl}/getItemMapping`, setMapping, setIsLoading);
  }, []);

  useEffect(() => {
    if (config) {
      reset(config);
    }
  }, [config]);

  const headers = [
    { label: "MV Tag Id", key: "tagId" },
    { label: "Bin Serial", key: "binId" },
    { label: "Name", key: "productName" },
  ];

  const generateTagsCount = (watchBinTags: any) => {
    let tagsData: any = [];
    const binTagStartRange = watchBinTags[0] ? Number(watchBinTags[0]) : 0;
    const binTagEndRange = watchBinTags[1] ? Number(watchBinTags[1]) : 0;
    if (binTagStartRange >= 0 && binTagEndRange >= 0) {
      for (let i = binTagStartRange; i < binTagEndRange; i++) {
        let payload = {};
        if (mapping) {
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
                  id="INPUT_CUSTOMER_HOSPITAL"
                  label="Customer / Hospital"
                  name="name"
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
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <UiFormTextField
                  size="small"
                  control={control}
                  defaultValue=""
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
                      label="Rack Tags(1-100)"
                      name="rackTag"
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
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                    <UiFormTextField
                      size="small"
                      fieldType="number"
                      control={control}
                      defaultValue=""
                      id="INPUT_BIN_TAGS_MIX"
                      label="MV Tags ( Min)"
                      name="binTagStartRange"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                    <UiFormTextField
                      size="small"
                      fieldType="number"
                      control={control}
                      defaultValue=""
                      id="INPUT_BIN_TAGS_MAX"
                      label="MV Tags ( Max)"
                      name="binTagEndRange"
                    />
                  </Grid>
                </Grid>

                <Box mt={2} mb={2}>
                  <Button
                    onClick={onGetFormValues}
                    color="warning"
                    variant="contained"
                    size="small"
                  >
                    Download Tags
                  </Button>
                </Box>

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
                  </CardActions>
                </Box>
                <Box mt={2}>
                  <CardActions sx={{ paddingLeft: 0 }}>
                    <UiDropZone
                      onDrop={(acceptedFiles) => {
                        Papa.parse(acceptedFiles[0], {
                          complete: function (results) {
                            setFile(acceptedFiles[0]);
                          },
                        });
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
                    <Grid item xs={12}>
                      <InputLabel
                        sx={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: "rgba(0, 0, 0, 0.6)",
                        }}
                      >
                        Time Zone
                      </InputLabel>
                      <select {...register("timezone")}>
                        {countries.map((item, index) => (
                          <option key={index} value={item.timezones[0]}>
                            {item.timezones[0]}
                          </option>
                        ))}
                      </select>
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
                        {Array.from({ length: 11 }, (_, i) => i + 1).map(
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
                        {Array.from({ length: 60 }, (_, i) => i + 1).map(
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
        <Box mt={3}>
          <CardActions sx={{ paddingLeft: 0, paddingTop: "15px" }}>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              size="small"
            >
              Submit
            </Button>
            <Button variant="contained" color="error" size="small">
              Cancel
            </Button>
          </CardActions>
        </Box>
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
                            {index % 2 === 0 ? "A" : "B"}
                          </Typography>
                          <Typography
                            fontSize="11px"
                            display="block"
                            textAlign="center"
                            variant="caption"
                          >
                            <b>No:{item.binId}</b>
                          </Typography>
                          <Typography
                            fontSize="11px"
                            display="block"
                            textAlign="center"
                            variant="caption"
                          >
                            <b>Name:{item.productName}</b>
                          </Typography>
                          <Typography
                            fontSize="11px"
                            display="block"
                            textAlign="center"
                            variant="caption"
                          >
                            <b>MV TAG ID:{item.tagId}</b>
                          </Typography>
                        </Grid>
                        <Grid textAlign="center" item md={6}>
                          <img src={item?.url} alt="left-shelf-tag" />
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