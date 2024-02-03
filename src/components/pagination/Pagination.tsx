import { IconButton, Tooltip } from '@mui/material';
import styles from '../../styles/pagination.module.scss'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

interface Props {
    pageSize: number;
    page: number;
    disableNext: boolean;
    total: number;
    ammount: number;
    setPageSize: (pageSize:number) => any;
    setPage: (page: number) => any;
}

export const Pagination = ({disableNext, page, pageSize, setPage, setPageSize, ammount, total}: Props) => {
  return (
    <div className={styles.pagination_container}>
      <div className={styles.paination_caption}>
          Displaying {ammount} of {total} records
        </div>
      <div className={styles.pagination}>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <Tooltip title="Previous">
          <span>
            <IconButton disabled={page === 1} onClick={() => setPage(page - 1)}>
              <FaAngleLeft />
            </IconButton>
          </span>
        </Tooltip>
        <div className={styles.current_page}>{page}</div>
        <Tooltip title="Next">
          <span>
            <IconButton
              disabled={disableNext}
              onClick={() => setPage(page + 1)}
            >
              <FaAngleRight />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};
