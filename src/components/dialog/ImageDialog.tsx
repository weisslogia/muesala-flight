import { IconButton, Tooltip } from "@mui/material";
import styles from "../../styles/dialog.module.scss";
import { FaBan, FaCheck } from "react-icons/fa6";
interface Props {
  photo: string;
  onClose: () => any;
}
export const ImageDialog = ({ photo, onClose }: Props) => {
  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.dialog_container} onClick={onClose}>
        <div className={styles.dialog}>
          <div className={styles.dialog_image_body}>
            <img src={photo} />
          </div>
        </div>
      </div>
    </>
  );
};
