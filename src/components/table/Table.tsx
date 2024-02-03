import { Button, IconButton, Tooltip } from "@mui/material";
import styles from "../../styles/table.module.scss";
import {
  FaCircleExclamation,
  FaMagnifyingGlass,
  FaPlus,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loading } from "../loading/Loading";
import { Pagination } from "../pagination/Pagination";

interface Props {
  columns_headers: { key: string; value: string }[];
  create_new_path?: string;
  data: any[];
  loading?: boolean;
  pageSize: number;
  page: number;
  total: number;
  onSearch: (query: string) => any;
  renderCell: (data: any, cell: { key: string; value: string }) => any;
  setPageSize: (size: number) => any;
  setPage: (page: number) => any;
}

export const Table = ({
  columns_headers,
  create_new_path,
  data,
  loading,
  pageSize,
  page,
  total,
  onSearch,
  renderCell,
  setPage,
  setPageSize,
}: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const grid_template = columns_headers.map((_el) => "1fr").join(" ");
  const search = () => {
    if (!/^[a-zA-Z]*$/i.test(searchValue)) {
      return setError("Invalid code format");
    } else {
      setError("")
      onSearch(searchValue);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      search()
    },1000)
    return () => clearTimeout(timeout)
  }, [searchValue])

  return (
    <div className={styles.table}>
      <div className={styles.table_header} style={{ width: "700px" }}>
        <div className={styles.table_title}>
          <div className={styles.search_container}>
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(ev) => setSearchValue(ev.target.value)}
            />
            {error && (
              <Tooltip title={error} arrow placement="top">
                <Button
                  className="form_error_button"
                  variant="text"
                  color="error"
                >
                  <FaCircleExclamation />{" "}
                </Button>
              </Tooltip>
            )}
            <IconButton onClick={search}>
              <FaMagnifyingGlass />
            </IconButton>
          </div>
          {create_new_path && (
            <div className={styles.general_actions}>
              <Link to={create_new_path}>
                <Tooltip title="Add Flight">
                  <IconButton className={styles.create_button}>
                    <FaPlus />
                  </IconButton>
                </Tooltip>
              </Link>
            </div>
          )}
        </div>
        <div
          className={`${styles.grid} ${styles.table_header}`}
          style={{ gridTemplateColumns: grid_template }}
        >
          {columns_headers.map((column, index) => (
            <span className={styles.column} key={index}>
              {column.value}
            </span>
          ))}
        </div>
      </div>
      {error === "" && (
        <>
          <div className={styles.table_body}>
            {loading && (
              <div className={styles.loading_container}>
                <Loading />
              </div>
            )}
            {!loading &&
              data.map((element, index) => (
                <div
                  key={index}
                  className={`${styles.grid} ${styles.table_row} ${
                    index % 2 === 0 ? styles.colored : ""
                  }`}
                  style={{ gridTemplateColumns: grid_template }}
                >
                  {columns_headers.map((column, index1) => (
                    <div className={styles.column} key={index1}>
                      {renderCell(element, column)}
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <Pagination
            disableNext={data.length !== pageSize}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            ammount={data.length}
            total={total}
          />
        </>
      )}
    </div>
  );
};
