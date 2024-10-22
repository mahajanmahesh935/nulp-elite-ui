import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  DialogActions,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import * as util from "../../services/utilService";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import submissions from "./lernSubmission.json";
import Paper from "@mui/material/Paper";
import { useNavigate, useLocation } from "react-router-dom";
import { Pagination } from "@mui/material";

import Footer from "components/Footer";
import Header from "components/header";

const LernReviewList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const _userId = util.userId(); // Assuming util.userId() is defined
  const urlConfig = require("../../configs/urlConfig.json");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const routeConfig = require("../../configs/routeConfig.json");

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, [page, rowsPerPage, search]);

  const fetchData = async () => {
    const assetBody = {
      request: {
        filters: {
          //   created_by: _userId,
          status: "review",
        },
        sort_by: {
          created_on: "desc",
        },
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        search: search,
      },
    };
    try {
      const response = await fetch(`${urlConfig.URLS.LEARNATHON.LIST}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assetBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch list");
      }

      const result = await response.json();
      console.log("suceesss----", result);
      console.log(result.result);
      setData(result.result.data);
      setTotalRows(result.result.totalCount);
    } catch (error) {
      console.log("error---", error);
      // setError(error.message);
    } finally {
      // setIsLoading(false);
    }

    // Example API endpoint with limit, offset, and search params
    // const apiUrl = `https://api.example.com/submissions?limit=${rowsPerPage}&offset=${
    //   page * rowsPerPage
    // }&search=${search}`;
    // const response = await fetch(apiUrl);

    // const result = await response.json();
    // console.log(submissions);
    // setData(submissions.result.data);
    // setTotalRows(result.totalCount);
  };

  const fetchUserData = async () => {
    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.GET_PROFILE}${_userId}`;
      const response = await fetch(url);
      const data = await response.json();
      const rootOrgId = data.result.response.rootOrgId;
      console.log(" data.result.response -----", data.result.response);

      //   sessionStorage.setItem("rootOrgId", rootOrgId);
      //   sessionStorage.setItem(
      //     "userDomain",
      //     data.result.response.framework.board
      //   );
      const rolesData = data.result.response.roles;
      const roles = rolesData?.map((roleObject) => roleObject.role);
      setIsSystemAdmin(roles.includes("SYSTEM_ADMINISTRATION"));

      // Convert the roles array to a JSON string
      const rolesJson = JSON.stringify(roles);
      console.log(" data.result.response -----", rolesJson);

      // Save the JSON string to sessionStorage
      //   sessionStorage.setItem("roles", rolesJson);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeletePollConfirmed = async (id) => {
    event.stopPropagation();
    try {
      const response = await fetch(
        `${urlConfig.URLS.LEARNATHON.DELETE}?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch polls");
      }

      const result = await response.json();
      console.log("suceesss----", result);
      setDialogOpen(false);
    } catch (error) {
      console.log("error---", error);
      // setError(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  const deleteContent = async (id) => {
    // show confirmation popup
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCardClick = async () => {
    navigate("/webapp/mylernsubmissions");
  };

  return (
    <>
      <Header />
      {isSystemAdmin && (
        <Paper sx={{ padding: "20px", backgroundColor: "#f9f4eb" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" gutterBottom className="fw-600 mt-20">
              Learnathon Review List
            </Typography>
          </Box>
          <Grid container>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <TextField
                  variant="outlined"
                  placeholder="Search Submission"
                  value={search}
                  onChange={handleSearchChange}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                  size="small"
                  sx={{ background: "#fff" }}
                />
              </Box>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead sx={{ background: "#D8F6FF" }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.title_of_submission}</TableCell>
                    <TableCell>
                      {new Date(row.updated_on).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      style={{
                        color:
                          row.status === "live"
                            ? "green"
                            : row.status === "review"
                            ? "orange"
                            : "red",
                        textTransform: "capitalize",
                      }}
                    >
                      {row.status}
                    </TableCell>
                    <TableCell>
                      {row.status == "review" && (
                        <Button
                          className="viewAll"
                          sx={{
                            padding: "7px 45px",
                            borderRadius: "90px !important",
                          }}
                          onClick={
                            () =>
                              (window.location.href =
                                routeConfig.ROUTES.PLAYER_PAGE.PLAYER +
                                "?id=do_1140802311509934081375&page=review")
                            // +row.learnathon_content_id
                          }
                          // sx={{ color: "#057184" }}
                          // className="table-icon"
                        >
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Paper>
      )}
      {!isSystemAdmin && (
        <Paper sx={{ padding: "20px", backgroundColor: "#f9f4eb" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            Review is not available for your role. You can participate in
            contest
            <Button className="viewAll" onClick={handleCardClick}>
              {t("PARTICIPATE_NOW")}
            </Button>
          </Box>
        </Paper>
      )}
      <Footer />
    </>
  );
};

export default LernReviewList;
