import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
import styles from "../styles/layout.module.scss";
import { Button, IconButton, Menu, MenuItem, Switch } from "@mui/material";
import { FaMoon, FaSun, FaUserCircle } from "react-icons/fa";

export const Dashboard = () => {
  const router = useNavigate();
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );
  const [user, setUser] = useState<any>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    handleClose();
    router(ROUTES.LOGIN);
  };

  useEffect(() => {
    const is_login = localStorage.getItem("token");
    if (!is_login) {
      router(ROUTES.LOGIN);
    } else {
      const raw_user = localStorage.getItem("user")
      if(raw_user) {
        setUser(JSON.parse(raw_user))
      }
    }
  }, []);
  return (
    <div className={styles.container} data-theme={theme}>
      <div className={styles.app_bar}>
        <div className={styles.menu_container}>
          <div className={styles.toggle_container}>
            <FaSun />
            <Switch
              onChange={(evt) => {
                const theme = evt.target.checked ? "dark" : "light";
                localStorage.setItem('theme', theme)
                setTheme(theme);
              }}
              defaultChecked={theme === "dark"}
              aria-label="Toggle theme"
            />
            <FaMoon />
          </div>
          <Button
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <FaUserCircle />
            <span className={styles.username}>
            {user && user.name}
            </span>
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
      {<Outlet />}
    </div>
  );
};
