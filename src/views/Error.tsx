import styles from "../styles/error.module.scss";
import { Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
export const Error = () => {
  const {
    state: { code, message, type },
  } = useLocation();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.code}>Code: {code}</div>
        <div className={styles.title}>{type}</div>
        <div className={styles.description}>{message}</div>
        <div className={styles.actions}>
          <Link to={ROUTES.HOME}>
            <Button variant="contained">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
