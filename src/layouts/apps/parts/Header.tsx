import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  IconButton,
  Link,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Menu as MenuIcon } from "@material-ui/icons";
import { Link as LinkDom } from "react-router-dom";
import {
  setSidebarClose,
  setSidebarOpen,
} from "../../../store/actions/sidebar.action";
import LogoFull from "../../../components/LogoFull";

const Header: React.FC<any> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { isOpen } = useSelector(({ sidebar }: any) => ({
    isOpen: sidebar.isOpen,
  }));

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      className={classes.root}
    >
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={() =>
            dispatch(isOpen ? setSidebarClose() : setSidebarOpen())
          }
        >
          <MenuIcon />
        </IconButton>

        <Hidden smDown>
          <Link component={LinkDom} to={"/apps/dashboard"}>
            <LogoFull />
          </Link>
        </Hidden>

        <Box ml="auto" display={"flex"} justifyContent={"end"}>
          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const Account: React.FC<any> = () => {
  const classes = useStyles();

  const { user } = useSelector(({ auth }: any) => ({
    user: auth.user,
  }));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const photoUrl = () =>
    `https://ui-avatars.com/api/?name=${encodeURI(
      user.name
    )}&color=7F9CF5&background=EBF4FF`;

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar alt={user.name} src={photoUrl()} className={classes.avatar} />
      </IconButton>

      <Menu
        getContentAnchorEl={null}
        id="account-menu"
        classes={{
          paper: classes.menu,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
      >
        <Box px={2} py={1} m={0} className={"profile-information"}>
          <Typography
            variant="subtitle1"
            gutterBottom
            className={"account-name"}
          >
            {user.name}
          </Typography>
          <Typography
            variant="caption"
            gutterBottom
            className={"account-email"}
          >
            {user.email}
          </Typography>
        </Box>

        <Divider variant="middle" />

        <Box py={1}>
          <MenuItem
            component={LinkDom}
            to={"/apps/profile"}
            onClick={handleClose}
          >
            <Typography variant={"subtitle2"}>Profile</Typography>
          </MenuItem>

          <MenuItem
            component={LinkDom}
            to={"/apps/preference"}
            onClick={handleClose}
          >
            <Typography variant={"subtitle2"}>Setting</Typography>
          </MenuItem>
        </Box>

        <Box px={2} py={1}>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            fullWidth
            component={LinkDom}
            to={"/logout"}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: "1px -5px 21px 0 rgb(93 130 170 / 21%)",
  },

  menuButton: {
    marginRight: theme.spacing(2),

    [theme.breakpoints.down("sm")]: {
      marginRight: "unset",
    },
  },

  //account component
  avatar: {
    width: 32,
    height: 32,
  },
  menu: {
    marginTop: theme.spacing(1),
    width: 220,
    borderRadius: theme.spacing(1),
    boxShadow: "0 9px 21px 0 rgb(93 130 170 / 21%)",

    "& a": {
      color: theme.palette.text.primary,
      textDecoration: "none",
      ":hover": {
        textDecoration: "none",
      },
    },

    "& a:hover": {
      textDecoration: "none",
    },

    "& .profile-information": {
      outline: "none",

      "& .account-name": {
        margin: 0,
        fontWeight: 600,
      },

      "& .account-email": {
        margin: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "inline-block",
        width: 190,
        color: "rgb(99, 115, 129)",
      },
    },
  },
}));

export default Header;
