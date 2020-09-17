import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { getPositiveFactor, getNegativeFactor } from "../api";

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

const Factor = (props) => {
  const [positiveFactor, setPositiveFactor] = useState([]);
  const [negativeFactor, setNegativeFactor] = useState([]);
  const [isPositive, setIsPositive] = useState(1);
  const { setErrorMessage } = props;

  useEffect(() => {
    const f = async () => {
      try {
        const positiveRes = await getPositiveFactor();
        setPositiveFactor(positiveRes.data);
        const negativeRes = await getNegativeFactor();
        setNegativeFactor(negativeRes.data);
      } catch (err) {
        setErrorMessage(err);
      }
    };
    f();
  }, []);

  return (
    <div>
      <AppBar
        position="static"
        style={{ backgroundColor: "white", color: "black", boxShadow: "none" }}
      >
        <Tabs
          value={isPositive}
          onChange={(event, newValue) => setIsPositive(newValue)}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="ポジティブ" />
          <Tab label="ネガティブ" />
        </Tabs>
      </AppBar>
      <TabPanel value={isPositive} index={1}>
        {positiveFactor.length !== 0 ? (
          <div>
            {positiveFactor[0]}
            <hr />
            {positiveFactor[1]}
            <hr />
            {positiveFactor[2]}
            <hr />
          </div>
        ) : (
          "データがありません"
        )}
      </TabPanel>
      <TabPanel value={isPositive} index={0}>
        {negativeFactor.length !== 0 ? (
          <div>
            {negativeFactor[0]}
            <hr />
            {negativeFactor[1]}
            <hr />
            {negativeFactor[2]}
            <hr />
          </div>
        ) : (
          "データがありません"
        )}
      </TabPanel>
    </div>
  );
};

export default Factor;
