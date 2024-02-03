import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/login/LoginForm";
import { signup } from "../services/login";
import styles from "../styles/login.module.scss";
import { Login } from "../types/Login";
import { Signup } from "../types/Signup";
import { ROUTES } from "../routes";
import { ResponseError } from "../types/Error";
import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
export const Register = () => {
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const router = useNavigate();

  useEffect(() => {
    const is_login = localStorage.getItem("token")
        if(is_login) {
            router(ROUTES.HOME)
        }
  }, [])

  const onSubmit = async (values: Signup | Login) => {
    const result = await signup(values as Signup);
    if (result.errors) {
      const error_data = result as ResponseError;
      setSnackBarMessage(error_data.message);
      setOpenSnackBar(true);
    } else {
      router(ROUTES.HOME);
    }
  };

  return (
    <div className={styles.container} data-theme="dark">
      <LoginForm isLogin={false} onSubmit={onSubmit} />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
