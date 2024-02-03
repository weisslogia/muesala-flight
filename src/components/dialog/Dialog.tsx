import { IconButton, Tooltip } from "@mui/material";
import styles from "../../styles/dialog.module.scss";
import { FaBan, FaCheck } from "react-icons/fa6";
interface Props {
  title?: string;
  body?: string;
  onClose: () => any;
  onConfirm: () => any;
}
export const ConfirmDialog = ({ title, body, onClose, onConfirm }: Props) => {
  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.dialog_container}>
        <div className={styles.dialog}>
          <div className={styles.dialog_title}>
            {title ? title : "Confirmation"}
          </div>
          <div className={styles.dialog_body}>
            {body
              ? body
              : "Are you sure you want to continue with the operation?"}
          </div>
          <div className={styles.dialog_actions_container}>
            <div className={styles.dialog_actions}>
              <Tooltip title="Cancel">
                <IconButton onClick={onClose}>
                  <FaBan />
                </IconButton>
              </Tooltip>
              <Tooltip title="Confirm">
                <IconButton color="primary" onClick={onConfirm}>
                  <FaCheck />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
