import { useEffect, useState } from "react";
import styles from "../../styles/flight.module.scss";
import { Flight, FlightResponse } from "../../types/Flight";
import { deleteFlight, getFlights } from "../../services/flight";
import { ResponseError } from "../../types/Error";
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleRequestErrors } from "../../helpers/request.helper";
import {
  FaEye,
  FaImage,
  FaPen,
  FaTrash,
} from "react-icons/fa6";
import { ROUTES } from "../../routes";
import { ConfirmDialog } from "../dialog/Dialog";
import { showMsg } from "../../helpers/toast.helper";
import { Loading } from "../loading/Loading";
import { ImageDialog } from "../dialog/ImageDialog";
import { Table } from "../table/Table";
import { Config } from "../../config";

export const FlightTable = () => {
  const [queryParameters] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useNavigate();

  const [page, setPage] = useState<number>(
    queryParameters.get("page") ? Number(queryParameters.get("page")) : 1
  );
  const [pageSize, setPageSize] = useState<number>(
    queryParameters.get("pageSize")
      ? Number(queryParameters.get("pageSize"))
      : 10
  );
  const [query, setQuery] = useState<string>(queryParameters.get("query") || "");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [refresh, setRefresh] = useState<number>(0);
  const columns = [
    { key: "code", value: "Code" },
    { key: "capacity", value: "Capacity" },
    { key: "departureDate", value: "Departure Date" },
    { key: "photo", value: "Photo" },
    { key: "actions", value: "Actions" },
  ];
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const [displayImageDialog, setDisplayImageDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<string>("");

  const loadFlights = async (quiet: boolean = false) => {
    if(!quiet) {
      setLoading(true);
    }
    const response = await getFlights(page, pageSize, query);
    if ("errors" in response) {
      const error_data = response as ResponseError;
      const result = await handleRequestErrors(error_data, router);
      if (result && result.refresh && refresh < 10) {
        setRefresh(refresh + 1);
      } else {
        showMsg(error_data.message, { type: "error", theme: "colored" });
      }
    } else {
      const flights = response as FlightResponse;
        setFlights(flights.resources);
        setTotal(flights.total);
    }
    if(!quiet) {
      setLoading(false);
    }
  };

  const onCloseDialog = () => {
    setDisplayDialog(false);
    setDisplayImageDialog(false);
    setDialogData("");
  };

  const onConfirmDialog = async (): Promise<void> => {
    const response = await deleteFlight(dialogData);
    if (response !== null) {
      const error_data = response as ResponseError;
      const result = await handleRequestErrors(error_data, router);
      if (result && result.refresh && refresh < 10) {
        setRefresh(refresh + 1);
        return await onConfirmDialog();
      } else {
        showMsg(error_data.message, { type: "error", theme: "colored" });
      }
    } else {
      setRefresh(refresh === 1 ? 2 : 1);
      showMsg("Flight deleted correctly", { type: "info", theme: "colored" });
      onCloseDialog();
    }
  };

  useEffect(() => {
    if (page || pageSize || query) {
      router(`${ROUTES.HOME}?page=${page}&pageSize=${pageSize}&query=${query}`);
    }
    loadFlights();
  }, [refresh, page, pageSize, query]);

  useEffect(() => {
    if(flights.filter(el => el.status === 'processing').length > 0) {
      setTimeout(() => loadFlights(true), 5000)
    }
  },[flights])

  const renderCell = (data: any, cell: { key: string; value: string }) => {
    const cellValue = data[cell.key];
    switch (cell.key) {
      case "code":
      case "capacity":
      case "departureDate":
        return (
          <span className={styles.column}>
            <span className={styles.label}>{cell.value}: </span>
            {cellValue}
          </span>
        );
      case "photo":
        return (
          <>
            <span className={`${styles.column} ${styles.image_dialog}`}>
              {data.status === "ready" && (
                <FaImage
                  onClick={() => {
                    setDialogData(`${Config.API_URL}/flights/${data.id}/photo`);
                    setDisplayImageDialog(true);
                  }}
                />
              )}
              {data.status === "processing" && (
                <div className={styles.row_loading_container}>
                  <Loading scale={0.5} size="20px" />
                </div>
              )}
            </span>
            {data.status === "ready" && (
              <div className={styles.image_preview}>
                <img src={`${Config.API_URL}/flights/${data.id}/photo`} />
              </div>
            )}
          </>
        );
      case "actions":
        return (
          <div className={styles.action}>
            <Tooltip title="Edit">
              <IconButton className={styles.action_button} onClick={() => router(`${ROUTES.FLIGHT}/${data.id}`)}>
                <FaPen />
              </IconButton>
            </Tooltip>
            <Tooltip className={styles.action_button} title="Delete">
              <IconButton
                onClick={() => {
                  setDialogData(data.id ? data.id : "");
                  setDisplayDialog(true);
                }}
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
            <Tooltip className={styles.action_button} title="Display">
              <IconButton
                onClick={() => router(`${ROUTES.FLIGHT}/${data.id}/display`)}
              >
                <FaEye />
              </IconButton>
            </Tooltip>
          </div>
        );
      default:
        return <span>Default</span>;
    }
  };

  return (
    <div className={styles.container}>
      {displayDialog && (
        <ConfirmDialog onClose={onCloseDialog} onConfirm={onConfirmDialog} />
      )}
      {displayImageDialog && (
        <ImageDialog onClose={onCloseDialog} photo={dialogData} />
      )}
      <Table
        columns_headers={columns}
        create_new_path={ROUTES.FLIGHT}
        data={flights}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        setPage={setPage}
        setPageSize={setPageSize}
        onSearch={setQuery}
        renderCell={renderCell}
      />
    </div>
  );
};
