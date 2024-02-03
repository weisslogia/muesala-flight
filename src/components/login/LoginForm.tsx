import { Field, Form, Formik } from "formik";
import styles from "../../styles/login.module.scss";
import {
  FaCircleExclamation,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
} from "react-icons/fa6";
import { Button, Tooltip } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes";
import { Signup } from "../../types/Signup";
import { Login } from "../../types/Login";
import { Loading } from "../loading/Loading";

interface Props {
  isLogin: boolean;
  onSubmit: (values: Signup | Login) => any;
}

export const LoginForm = ({ isLogin, onSubmit }: Props) => {
  const [password_state, set_password_state] = useState<string>("password");
  const toggle_password = () => {
    set_password_state(password_state === "text" ? "password" : "text");
  };

  const initialValues = isLogin
    ? { email: "", password: "" }
    : { email: "", password: "", name: "" };

  return (
    <div className={styles.form_container}>
      <div className={styles.title}>
        <h1> {isLogin ? "Login" : "Signup"}</h1>
      </div>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: any = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors, values }) => (
          <Form className={styles.form}>
            {!isLogin && (
              <div className={styles.field_container}>
                <FaUser className={styles.icon_color} />
                <Field
                  className={styles.field}
                  type="text"
                  name="name"
                  placeholder="Name"
                />
                {errors.name && (
                  <Tooltip title={errors.name} arrow placement="top">
                    <Button
                      className="form_error_button"
                      variant="text"
                      color="error"
                    >
                      <FaCircleExclamation />{" "}
                    </Button>
                  </Tooltip>
                )}
              </div>
            )}

            <div className={styles.field_container}>
              <FaEnvelope className={styles.icon_color} />
              <Field
                className={styles.field}
                type="email"
                name="email"
                placeholder="Email"
              />
              {errors.email && (
                <Tooltip title={errors.email} arrow placement="top">
                  <Button
                    className="form_error_button"
                    variant="text"
                    color="error"
                  >
                    <FaCircleExclamation />{" "}
                  </Button>
                </Tooltip>
              )}
            </div>
            <div className={styles.field_container}>
              <FaLock className={styles.icon_color} />
              <Field
                className={styles.field}
                placeholder="Password"
                type={password_state}
                name="password"
              />
              {values.password && (
                <button
                  className={`form_error_button ${styles.show_password}`}
                  type="button"
                  onClick={toggle_password}
                >
                  {password_state === "text" ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
            <Button
              className={styles.loading_button}
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className={styles.loading_anim}>
                  <Loading scale={0.3} size="20px" />
                  Loading
                </div>
              )}
              {isSubmitting && isLogin ? "Login" : "Signup"}
            </Button>
          </Form>
        )}
      </Formik>
      <div className={styles.create_account}>
        {isLogin ? (
          <>
            <span>Don't have an account?</span>{" "}
            <Link to={ROUTES.REGISTER}>Signup</Link>
          </>
        ) : (
          <>
            <span>Already have an account?</span>{" "}
            <Link to={ROUTES.LOGIN}>Login</Link>
          </>
        )}
      </div>
    </div>
  );
};
