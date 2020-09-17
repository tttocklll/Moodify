import React, { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

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
  const { am, pm } = props;
  // TODO: シーン取得
  // TODO: 質疑応答取得
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
        {am ? (
          <div>
            感情値：{am.emotion_value}「{am.emotion_phrase}」 コメント：
            {am.comment}
          </div>
        ) : (
          "データがありません"
        )}
      </TabPanel>
      <TabPanel value={isMorning} index={1}>
        {pm ? (
          <div>
            感情値：{pm.emotion_value}「{pm.emotion_phrase}」 コメント：
            {pm.comment}
          </div>
        ) : (
          "データがありません"
        )}
      </TabPanel>
    </div>
  );
};

export default DailyResult;
