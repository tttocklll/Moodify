import React, { useState } from "react";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};



const Factor = () => {
  const [factor, setFactor] = useState(null);
  const [isPositive, setIsPositive] = useState(1);

  return (
    <div >
      <AppBar position="static" style={{ backgroundColor: "white", color: "black", boxShadow: "none" }}>
        <Tabs value={isPositive} onChange={(event, newValue) => setIsPositive(newValue)} aria-label="simple tabs example" variant="fullWidth">
          <Tab label="ポジティブ" />
          <Tab label="ネガティブ" />
        </Tabs>
      </AppBar>
      <TabPanel value={isPositive} index={1}>
        {factor ?
          <div>
            {factor[0]}
            <hr />
            {factor[2]}
            <hr />
            {factor[3]}
            <hr />
          </div>
          : "データがありません"}
      </TabPanel>
      <TabPanel value={isPositive} index={0}>
        {factor ?
          <div>
            {factor[0]}
            <hr />
            {factor[2]}
            <hr />
            {factor[3]}
            <hr />
          </div>
          : "データがありません"}
      </TabPanel>
    </div>
  );
}

export default Factor;