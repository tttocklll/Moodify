import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from "@material-ui/icons/AccountCircle";
// import MenuItem from '@material-ui/core/MenuItem';
// import Menu from '@material-ui/core/Menu';
import ChatIcon from "@material-ui/icons/Chat";
import TodayIcon from "@material-ui/icons/Today";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  active: { borderBottom: "solid 1px red", borderRadius: 0 },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
            <button
              style={{
                font: "inherit",
                backgroundColor: "inherit",
                border: "inherit",
                color: "inherit",
              }}
              onClick={() =>
                history.push(
                  ["/", "/signup", "/login"].includes(location.pathname)
                    ? "/"
                    : "/dashboard"
                )
              }
            >
              Moodify
            </button>
          </Typography>
          {!["/", "/signup", "/login"].includes(location.pathname) && (
            <div>
              <IconButton
                aria-label="chat page"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => history.push("/dashboard")}
                className={location.pathname === "/dashboard" && classes.active}
              >
                <TodayIcon />
              </IconButton>
              <IconButton
                aria-label="chat page"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => history.push("/chat")}
                className={location.pathname === "/chat" && classes.active}
              >
                <ChatIcon />
              </IconButton>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => history.push("/mypage")}
                className={location.pathname === "/mypage" && classes.active}
              >
                <AccountCircle />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
