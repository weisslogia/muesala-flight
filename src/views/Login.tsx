import styles from "../styles/login.module.scss";
import { LoginForm } from "../components/login/LoginForm";
import { login } from "../services/login";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { ResponseError } from "../types/Error";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
export const Login = () => {
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false)
  const [snackBarMessage, setSnackBarMessage] = useState<string>("")
  const router = useNavigate();

  useEffect(() => {
    const is_login = localStorage.getItem("token")
        if(is_login) {
            router(ROUTES.HOME)
        }
  }, [])

  const onSubmit = async (values: any) => {
    const result = await login(values);
    if (result.errors) {
      const error_data = result as ResponseError;
      setSnackBarMessage(error_data.message)
      setOpenSnackBar(true)
    } else {
      router(ROUTES.HOME)
    }
  };
  return (
    <div className={styles.container} data-theme="dark">
      <LoginForm isLogin={true} onSubmit={onSubmit} />
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={() => setOpenSnackBar(false)}>
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
