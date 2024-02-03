import { Field, Form, Formik } from "formik";
import styles from "../../styles/login.module.scss";
import { Alert, Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import {
  FaAngleLeft,
  FaBan,
  FaCalendarDay,
  FaCircleExclamation,
  FaCode,
  FaFileImage,
  FaPeopleGroup,
} from "react-icons/fa6";
import {
  createFlight,
  createImageFlight,
  existCode,
  updateFlight,
  updateImageFlight,
} from "../../services/flight";
import { ResponseError } from "../../types/Error";
import { handleRequestErrors } from "../../helpers/request.helper";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ROUTES } from "../../routes";
import { showMsg } from "../../helpers/toast.helper";
import { Config } from "../../config";
import { FaDownload } from "react-icons/fa";
import { Loading } from "../loading/Loading";

interface FormValues {
  code?: string;
  capacity: number;
  departureDate: string;
  photo?: any;
  status?: string;
}

interface Props {
  id?: string;
  data?: FormValues | null;
  isDisplaying?: boolean;
}

export const FlightForm = ({ id, data, isDisplaying }: Props) => {
  const router = useNavigate();
  const [refresh, setRefresh] = useState<number>(0);

  const initialValues: FormValues = {
    code: id && data ? data.code : "",
    capacity: id && data ? data.capacity : 0,
    departureDate: id && data ? data.departureDate : "",
    photo: id && data ? data.photo : "",
  };

  const validate = (values: FormValues) => {
    const errors: any = {};
    if (!values.code) {
      errors.code = "Required";
    } else if (!/^[a-zA-Z]{6,}$/i.test(values.code)) {
      errors.code = "Invalid code format";
    }
    if (values.capacity < 1 || values.capacity > 200) {
      errors.capacity = "Capacity must be between 1 and 200";
    }
    return errors;
  };

  const onSubmit = async (values: FormValues): Promise<any> => {
    let response = {};
    response = await existCode(values.code, id);
    if ("exists" in response && !response["exists"]) {
      if (!id) {
        if (values.photo) {
          response = await createImageFlight(values);
        } else {
          delete values.photo;
          response = await createFlight(values);
        }
      } else {
        if (values.photo) {
          response = await updateImageFlight(id, values);
        } else {
          response = await updateFlight(id, values);
        }
      }
    }
    if ("exists" in response && response["exists"]) {
      console.log(response);
      return showMsg(`The code ${values.code} already exists`, {
        type: "warning",
        theme: "colored",
      });
    }

    if ("errors" in response) {
      const error_data = response as ResponseError;
      const result = await handleRequestErrors(error_data, router, false);
      showMsg(error_data.message, { type: "error", theme: "colored" });
      if (result && result.refresh && refresh < 10) {
        setRefresh(refresh + 1);
        return await onSubmit(values);
      } else {
        showMsg(error_data.message, { type: "error", theme: "colored" });
      }
    } else {
      showMsg(`Flight ${id ? "updated" : "crated"} correctly`, {
        type: "info",
        theme: "colored",
      });
      return router(ROUTES.HOME);
    }
  };

  return (
    <div className={styles.form_container}>
      <div className={styles.title}>
        <IconButton onClick={() => router(-1)}>
          <FaAngleLeft />
        </IconButton>
        <h1> {id ? "Update" : "Create"} Flight</h1>
      </div>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
        enableReinitialize={id !== null}
      >
        {({ isSubmitting, errors, values, setFieldValue }) => (
          <Form className={styles.form}>
            <div className={styles.field_container}>
              <FaCode className={styles.icon_color} />
              <Field
                className={styles.field}
                type="text"
                name="code"
                placeholder="code"
                disabled={isDisplaying}
              />
              {errors.code && (
                <Tooltip title={errors.code} arrow placement="top">
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
              <FaPeopleGroup className={styles.icon_color} />
              <Field
                className={styles.field}
                type="number"
                name="capacity"
                placeholder="Capacity"
                disabled={isDisplaying}
              />
              {errors.capacity && (
                <Tooltip title={errors.capacity} arrow placement="top">
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
              <FaCalendarDay className={styles.icon_color} />
              <Field
                className={styles.field}
                type="date"
                name="departureDate"
                placeholder="Departure date"
                disabled={isDisplaying}
              />
              {errors.departureDate && (
                <Tooltip title={errors.departureDate} arrow placement="top">
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
            {!isDisplaying && (
              <div className={styles.field_container}>
                <FaFileImage className={styles.icon_color} />
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    // @ts-ignore
                    setFieldValue("photo", event.currentTarget.files[0]);
                  }}
                />
                {values.photo && (
                  <button
                    className={`form_error_button ${styles.show_password}`}
                    type="button"
                    onClick={() =>
                      setFieldValue("photo", id && data ? data.photo : "")
                    }
                  >
                    <FaBan />
                  </button>
                )}
              </div>
            )}

            {values.photo && !isDisplaying && (
              <div className={styles.image_container}>
                <img src={URL.createObjectURL(values.photo)} />
              </div>
            )}

            {isDisplaying && data && data.status && data.status === "ready" && (
              <div className={styles.image_container}>
                <img src={`${Config.API_URL}/flights/${id}/photo`} />
                <IconButton
                  className={styles.float_download}
                  onClick={() => {
                    const url = `${Config.API_URL}/flights/${id}/photo`;
                    window.open(url, "_blank");
                  }}
                >
                  <FaDownload />
                </IconButton>
              </div>
            )}

            {!isDisplaying && (
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
                {!isSubmitting && id ? "Update" : "Create"}
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
