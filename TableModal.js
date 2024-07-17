import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize, faMinimize } from "@fortawesome/free-solid-svg-icons";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TableModal = ({ cardData, open, handleClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tableContainerRef = useRef();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!cardData || cardData.length === 0) return null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      tableContainerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = cardData
    ? cardData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const customStyles = {
    paper: {
      width: "80%", // Customize the width as per your requirement
      maxWidth: "none", // Ensure it doesn't adhere to the default maxWidth
      backgroundColor: "white", // Background color
    },
    dialogTitle: {
      backgroundColor: "rgb(178, 223, 251)", // Background color for the header
      color: "black", // Text color for the header
      padding: "16px 24px", // Adjust padding as needed
    },
    dialogActions: {
      backgroundColor: "rgb(178, 223, 251)", // Background color for the footer
      padding: "8px 24px", // Adjust padding as needed
      justifyContent: "flex-end", // Align buttons to the right
      color: "black",
    },
    dialogButton: { color: "black", backgroundColor: "white" },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper" // Ensures vertical scrolling within the modal
      maxWidth={false} // Disable the default maxWidth behavior
      PaperProps={{
        style: customStyles.paper,
      }}
      fullWidth
    >
      <DialogTitle style={customStyles.dialogTitle}>Post Details</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            width: isFullscreen ? "100vw" : "auto",
            height: isFullscreen ? "100vh" : "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ flex: "1 1 auto", maxHeight: "82vh", overflowY: "auto" }}
            ref={tableContainerRef}
          >
            <Table
              stickyHeader
              sx={{ minWidth: 1200, tableLayout: "fixed" }}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ width: "5%" }}>S.No</StyledTableCell>
                  <StyledTableCell sx={{ width: "10%" }}>Platform</StyledTableCell>
                  <StyledTableCell sx={{ width: "30%" }}>Content</StyledTableCell>
                  <StyledTableCell sx={{ width: "15%" }}>Date Published</StyledTableCell>
                  <StyledTableCell sx={{ width: "10%" }}>Keyword</StyledTableCell>
                  <StyledTableCell sx={{ width: "10%" }}>Media Present</StyledTableCell>
                  <StyledTableCell sx={{ width: "20%" }}>Post Owner</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData &&
                  paginatedData.length > 0 &&
                  paginatedData.map((data, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                      <StyledTableCell>{data.platform || "N/A"}</StyledTableCell>
                      <StyledTableCell>
                        <a href={data.link} target="_blank" rel="noopener noreferrer" style={{ color: "black", textDecoration: "none" }}>
                          {data.content || "N/A"}
                        </a>
                      </StyledTableCell>
                      <StyledTableCell>{data.datePublished || "N/A"}</StyledTableCell>
                      <StyledTableCell>{data.keyword || "N/A"}</StyledTableCell>
                      <StyledTableCell>{data.mediaPresent ? "Yes" : "No"}</StyledTableCell>

                      <StyledTableCell>
                        <a href={data.useHandle} target="_blank" rel="noopener noreferrer" style={{ color: "black", textDecoration: "none" }}>
                          {data.postOwner || "N/A"}
                        </a>
                      </StyledTableCell>

                      {/* <StyledTableCell>{data.postOwner || "N/A"}</StyledTableCell> */}

                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button onClick={toggleFullscreen}>
              {isFullscreen ? (
                <FontAwesomeIcon icon={faMinimize} fontSize={"20px"} />
              ) : (
                <FontAwesomeIcon icon={faMaximize} fontSize={"20px"} />
              )}
            </Button>
            <TablePagination
              component="div"
              count={cardData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ minWidth: "auto" }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions style={customStyles.dialogActions}>
        <Button
          onClick={handleClose}
          style={customStyles.dialogButton}
          className="modal-button"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableModal;
