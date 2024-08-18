import { useState } from "react";
import classes from "./PersonelTable.module.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { Button, ButtonGroup, Typography, Box } from "@mui/material";

export default function PersonelTable({
  head,
  body,
  searchable,
  handleRowClick,
  handleSort,
  sortConfig,
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = body.filter((row) =>
    row.some((item) =>
      item
        .toString()
        .toLocaleLowerCase("TR")
        .includes(search.toLocaleLowerCase("TR"))
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {searchable && (
        <div className={classes["table-props"]}>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            type="text"
            placeholder="Tabloda ara..."
            className={classes["search-input"]}
          />
          <button
            onClick={() => {
              setSearch("");
              setCurrentPage(1);
            }}
            className={classes["filter-clear-button"]}
          >
            Temizle
          </button>
        </div>
      )}
      <div className={classes["w-full"]}>
        <table className={classes["w-full"]}>
          <thead>
            <tr>
              {head.map((h, index) => (
                <th
                  className={classes["table-head"]}
                  key={index}
                  onClick={() => h.sortable && handleSort(index)}
                >
                  <div className={classes["table-head-inside"]}>
                    {h.name}
                    {h.sortable && (
                      <span className={classes["icon-button"]}>
                        {sortConfig.key === index ? (
                          sortConfig.direction === "ascending" ? (
                            <ArrowUpwardIcon />
                          ) : (
                            <ArrowDownwardIcon />
                          )
                        ) : (
                          <SwapVertIcon />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                className={classes["table-body"]}
                key={rowIndex}
                onClick={() => handleRowClick(row)}
              >
                {row.map((cell, cellIndex) => (
                  <td className={classes["table-body-inside"]} key={cellIndex}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={classes["pagination"]}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            my={2}
          >
            <ButtonGroup variant="contained" color="primary">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                sx={{ textTransform: "none" }}
              >
                Önceki
              </Button>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx={2}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Sayfa {currentPage} / {totalPages}
                </Typography>
              </Box>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                sx={{ textTransform: "none" }}
              >
                Sonraki
              </Button>
            </ButtonGroup>
          </Box>
        </div>
      </div>
    </>
  );
}
