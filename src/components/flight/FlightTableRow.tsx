import { Flight } from "../../types/Flight";
import styles from "../../styles/flight.module.scss";
import { FaEye, FaImage, FaPen, FaTrash } from "react-icons/fa";
import { IconButton, Tooltip } from "@mui/material";
import { Config } from "../../config";
import { ROUTES } from "../../routes";
import { useNavigate } from "react-router-dom";
import { Loading } from "../loading/Loading";

interface Props {
  flights: Flight[];
  setDialogData: (data: string) => any;
  setDisplayImageDialog: (data: boolean) => any;
  setDisplayDialog: (data: boolean) => any;
}
export const FlightTableRow = ({
  flights,
  setDialogData,
  setDisplayDialog,
  setDisplayImageDialog,
}: Props) => {
  const router = useNavigate();

  return flights.map((flight, index) => (
    <>
      <div
        key={index}
        className={`${styles.grid} ${styles.table_row} ${
          index % 2 === 0 ? styles.colored : ""
        }`}
      >
        <span className={styles.column}>
          <span className={styles.label}>Code: </span>
          {flight.code}
        </span>
        <span className={styles.column}>
          <span className={styles.label}>Capacity: </span>
          {flight.capacity}
        </span>
        <span className={styles.column}>
          <span className={styles.label}>Departure Date: </span>
          {flight.departureDate}
        </span>
        <span className={`${styles.column} ${styles.image_dialog}`}>
          {flight.status === "ready" && (
            <FaImage
              onClick={() => {
                setDialogData(`${Config.API_URL}/flights/${flight.id}/photo`);
                setDisplayImageDialog(true);
              }}
            />
          )}
          {flight.status === "processing" && (
            <div className={styles.row_loading_container}>
              <Loading scale={0.5} size="20px" />
            </div>
          )}
        </span>
        {flight.status === "ready" && (
          <div className={styles.image_preview}>
            <img src={`${Config.API_URL}/flights/${flight.id}/photo`} />
          </div>
        )}
        <div className={styles.action}>
          <Tooltip title="Edit">
            <IconButton onClick={() => router(`${ROUTES.FLIGHT}/${flight.id}`)}>
              <FaPen />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setDialogData(flight.id ? flight.id : "");
                setDisplayDialog(true);
              }}
            >
              <FaTrash />
            </IconButton>
          </Tooltip>
          <Tooltip title="Display">
            <IconButton
              onClick={() => router(`${ROUTES.FLIGHT}/${flight.id}/display`)}
            >
              <FaEye />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </>
  ));
};
