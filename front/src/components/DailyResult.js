import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AppBar, Tabs, Tab, Box, Button } from "@material-ui/core";
import { getPostDetails } from "../api";
import ErrorMessage from "./../components/ErrorMessage";
import ResultDetails from "./ResultDetails";

const emoji = ["😆", "😄", "😃", "😓", "😫", "😨"];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const DailyResult = (props) => {
  const [isMorning, setIsMorning] = useState(1);
  const [amDetails, setAmDetails] = useState(null);
  const [pmDetails, setPmDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { am, pm } = props;

  useEffect(() => {
    const f = async () => {
      try {
        const amRes = am ? await getPostDetails(am.id) : null;
        setAmDetails(amRes ? amRes.data : null);
        const pmRes = pm ? await getPostDetails(pm.id) : null;
        setPmDetails(pmRes ? pmRes.data : null);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };
    f();
  }, [am, pm]);

  return (
    <div>
      <AppBar
        position="static"
        style={{ backgroundColor: "white", color: "black", boxShadow: "none" }}
      >
        <Tabs
          value={isMorning}
          onChange={(event, newValue) => setIsMorning(newValue)}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="午前" />
          <Tab label="午後" />
        </Tabs>
      </AppBar>
      <TabPanel value={isMorning} index={0}>
        <ErrorMessage message={errorMessage} />
        {am && amDetails ? (
          <ResultDetails post={am} postDetails={amDetails} />
        ) : (
          "データがありません"
        )}
      </TabPanel>
      <TabPanel value={isMorning} index={1}>
        {pm && pmDetails ? (
          <ResultDetails post={pm} postDetails={pmDetails} />
        ) : (
          "データがありません"
        )}
      </TabPanel>
      <Button fullWidth onClick={props.onClose}>
        close
      </Button>
    </div>
  );
};

export default DailyResult;
