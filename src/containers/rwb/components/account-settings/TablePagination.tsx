import React, { useEffect, useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import { checkHrOverflow } from '../../../../utils/uiUtils';

type PaginationProps = {
  data: any;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const TablePagination = ({
  data,
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const [paginationOverflow, setPaginationOverflow] = useState(false);

  useEffect(() => {
    setPaginationOverflow(checkHrOverflow('.table-container', '.pagination'));
  }, [data]);

  return (
    <>
      {totalPages > 1 && (
        <Pagination className="mt-3 mx-auto mr-md-3 ml-md-auto">
          {!paginationOverflow ? (
            [...Array(totalPages)].map((_, i) => {
              return (
                <Pagination.Item
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  active={i + 1 === currentPage}
                >
                  {i + 1}
                </Pagination.Item>
              );
            })
          ) : (
            <>
              {currentPage > 2 && (
                <>
                  <Pagination.Item onClick={() => setCurrentPage(1)}>
                    1
                  </Pagination.Item>
                  {currentPage !== 3 && <Pagination.Ellipsis />}
                </>
              )}
              {[...Array(totalPages)].map(
                (_, i) =>
                  i >= currentPage - 2 &&
                  i < currentPage + 1 && (
                    <Pagination.Item
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      active={i + 1 === currentPage}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ),
              )}
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage !== totalPages - 2 && <Pagination.Ellipsis />}
                  <Pagination.Item onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </Pagination.Item>
                </>
              )}
            </>
          )}
        </Pagination>
      )}
    </>
  );
};

export default TablePagination;
