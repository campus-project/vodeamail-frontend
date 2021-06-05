import React, { useEffect } from "react";
import {
  Box,
  Button,
  ButtonBase,
  Divider,
  fade,
  Hidden,
  Link,
  makeStyles,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useIsMounted } from "../../../utilities/hooks/mounted.hook";
import useWindowSize from "../../../utilities/hooks/window-size.hook";
import { useDispatch, useSelector } from "react-redux";
import { sidebarOpenKey } from "../../../store/reducers/sidebar.reducer";
import {
  changeSidebarVariant,
  setSidebarClose,
  setSidebarOpen,
} from "../../../store/actions/sidebar.action";
import { grey } from "@material-ui/core/colors";
import LogoFull from "../../../components/LogoFull";
import { Link as LinkDom, NavLink } from "react-router-dom";
import { useLocation } from "react-router";
import classNames from "classnames";
import _ from "lodash";

const Sidebar: React.FC<any> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const theme = useTheme();
  const size = useWindowSize();

  const { anchor, isOpen, variant } = useSelector(({ sidebar }: any) => ({
    anchor: sidebar.anchor,
    isOpen: sidebar.isOpen,
    variant: sidebar.variant,
  }));

  useEffect(() => {
    handleResize(size[0] <= theme.breakpoints.values.md);
  }, [size]);

  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem(sidebarOpenKey, isOpen ? "1" : "0");
    }
  }, [isOpen]);

  const handleResize = (isMobile: boolean) => {
    if (isOpen) {
      dispatch(setSidebarClose());
      dispatch(changeSidebarVariant(isMobile ? "temporary" : "persistent"));
      dispatch(setSidebarOpen());
    } else {
      dispatch(changeSidebarVariant(isMobile ? "temporary" : "persistent"));
    }
  };

  const handleClick = () => {
    if (variant === "temporary" && isOpen) {
      dispatch(setSidebarClose());
    }
  };

  return (
    <SwipeableDrawer
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      anchor={anchor}
      variant={variant}
      open={isOpen}
      onClose={() => dispatch(setSidebarClose())}
      onOpen={() => dispatch(setSidebarOpen())}
    >
      <Box>
        <Hidden only={["xs", "sm"]}>
          <Toolbar />
        </Hidden>
        <Hidden mdUp>
          <Box display={"flex"} alignItems={"center"} p={2}>
            <LogoFull />
          </Box>
        </Hidden>

        <Box p={2}>
          <Link
            component={LinkDom}
            to={"/apps/campaign/email-campaign/create"}
            onClick={handleClick}
          >
            <Button fullWidth variant="contained" color={"primary"}>
              Create Campaign
            </Button>
          </Link>
        </Box>

        <MenuSidebar />
      </Box>

      <Box />
    </SwipeableDrawer>
  );
};

const MenuSidebar: React.FC<any> = () => {
  const classes = useStyles();
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { items, variant, isOpen } = useSelector(({ sidebar, menu }: any) => {
    return {
      items: menu.items,
      variant: sidebar.variant,
      isOpen: sidebar.isOpen,
    };
  });

  const isLinkActive = (menu: any): boolean => {
    return (
      makeActivePath(menu).filter(
        (p) => p === pathname || new RegExp(p).test(pathname)
      ).length > 0
    );
  };

  const makeActivePath = (menu: any): string[] => {
    const activePath: string[] = (menu?.children || [])
      .map((child: any) => {
        return child?.href || null;
      })
      .filter((a: any) => a);

    if (menu.href) {
      activePath.push(menu.href);
    }

    if (Array.isArray(menu.otherUrls)) {
      activePath.push(...menu.otherUrls);
    }

    return activePath;
  };

  const handleClick = () => {
    if (variant === "temporary" && isOpen) {
      dispatch(setSidebarClose());
    }
  };

  return (
    <>
      <Divider variant="middle" />

      <Box className={classes.sidebar}>
        <ul className={"nav-list"}>
          {items.map((menu: any, index: number) => (
            <li
              key={index}
              className={classNames({
                "nav-item": true,
                opened: !_.isEmpty(menu.children) && isLinkActive(menu),
              })}
            >
              <Link component={NavLink} to={menu.href} onClick={handleClick}>
                <ButtonBase
                  component={"label"}
                  className={classNames({
                    "nav-link": true,
                    active: _.isEmpty(menu.children) && isLinkActive(menu),
                  })}
                >
                  <i className={`${menu.icon} nav-icon`} />
                  <Typography variant={"body2"}>{menu.label}</Typography>
                </ButtonBase>
              </Link>

              {menu.children && (
                <Box className="nav-dropdown">
                  <ul className="dropdown-list">
                    {menu.children.map((child: any, childKey: number) => (
                      <li className="dropdown-item" key={childKey}>
                        <Link
                          component={NavLink}
                          to={child.href}
                          onClick={handleClick}
                        >
                          <ButtonBase
                            component={"label"}
                            className={classNames({
                              "dropdown-link": true,
                              active: isLinkActive(child),
                            })}
                          >
                            <Typography variant={"body2"}>
                              {child.label}
                            </Typography>
                          </ButtonBase>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </li>
          ))}
        </ul>
      </Box>
    </>
  );
};

const drawerWidth = 240;
export const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
    border: "unset",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  sidebar: {
    paddingTop: theme.spacing(2),

    "& .nav-list": {
      margin: 0,
      padding: 0,
      listStyle: "none",

      "& .nav-item": {
        margin: `2px ${theme.spacing(1.5)}px`,

        "& a": {
          textDecoration: "none",
          color: theme.palette.text.primary,
        },

        "&.opened": {
          color: theme.palette.primary.main,
          borderRadius: theme.shape.borderRadius,

          "& .nav-dropdown": {
            height: "100%",
          },
        },

        "& .nav-link": {
          display: "flex",
          justifyContent: "start",
          position: "relative",
          cursor: "pointer",
          padding: `${theme.spacing(0.7)}px ${theme.spacing(1.5)}px`,
          background: "white",
          borderRadius: theme.shape.borderRadius,
          alignItems: "center",
          transition: "all 0.5s ease",

          "&:hover": {
            background: grey[200],
            color: theme.palette.primary.main,
          },

          "&.active": {
            background: fade(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          },
        },

        "& .nav-icon": {
          minWidth: 30,
        },

        "& .nav-dropdown": {
          height: 0,
          marginBottom: 0,
          overflow: "hidden",
        },

        "& .dropdown-list": {
          padding: 0,
          listStyle: "none",
          marginLeft: 10,
          paddingLeft: 30,

          "& .dropdown-link": {
            display: "flex",
            justifyContent: "start",
            position: "relative",
            cursor: "pointer",
            padding: `${theme.spacing(0.7)}px ${theme.spacing(1.5)}px`,
            borderRadius: theme.shape.borderRadius,
            transition: "all 0.5s ease",

            "&:hover": {
              background: grey[200],
              color: theme.palette.primary.main,
            },

            "&.active": {
              background: fade(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            },
          },
        },
      },
    },
  },
}));

export default Sidebar;
