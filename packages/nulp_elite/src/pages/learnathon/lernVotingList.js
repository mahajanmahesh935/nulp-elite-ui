import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "components/Footer";
import Header from "components/header";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
const routeConfig = require("../../configs/routeConfig.json");
const urlConfig = require("../../configs/urlConfig.json");

const LernVotingList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [pollData, setPollData] = useState([]);
  const [voteCounts, setVoteCounts] = useState({}); // Object to store vote counts
  const [pageNumber, setPageNumber] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, search]);

  const fetchData = async () => {
    const assetBody = {
      request: {
        filters: {
          category: "Learnathon",
          status: ["Live"],
        },

        limit: rowsPerPage,
        offset: 10 * (currentPage - 1),
        search: search,
      },
    };
    try {
      const response = await fetch(`${urlConfig.URLS.POLL.LIST}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assetBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch polls");
      }

      const result = await response.json();
      setData(result.result.data);
      const pollIds = result.result.data.map((poll) => poll.poll_id);
      setPollData(pollIds);
      setTotalRows(Math.ceil(result.result.totalCount / 10));

      // Fetch vote counts for each poll
      getVoteCounts(pollIds);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const getVoteCounts = async (pollIds) => {
    try {
      const url = `${urlConfig.URLS.POLL.GET_VOTTING_LIST}`;
      const body = {
        poll_ids: pollIds,
      };
      const response = await axios.post(url, body);
      const data = response.data;

      // Map vote counts by poll_id
      const voteCountMap = {};
      data.result.polls.forEach((poll) => {
        voteCountMap[poll.poll_id] = poll.result[0].count; // Assuming result contains vote count
      });

      setVoteCounts(voteCountMap); // Set the vote count in state
    } catch (error) {
      console.error("Error fetching vote counts:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleClick = (contentId) => {
    navigate(`${routeConfig.ROUTES.PLAYER_PAGE.PLAYER}?id=${contentId}`);
  };

  const handleChange = (event, value) => {
    if (value !== pageNumber) {
      setPageNumber(value);
      setCurrentPage(value);
      fetchData();
    }
  };

  return (
    <>
      <Header />
      <Paper sx={{ padding: "20px", backgroundColor: "#f9f4eb" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" gutterBottom className="fw-600 mt-20">
            {t("VOTE_NOW_LEARNATHON_SUBMISSIONS")}
          </Typography>
        </Box>
        <Grid container>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                variant="outlined"
                placeholder={t("SEARCH_SUBMISSION")}
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
                <TableCell>{t("SUBMISSION_NAME")}</TableCell>
                <TableCell>{t("VOTING_DEADLINE")}</TableCell>
                <TableCell>{t("VOTE_COUNT")}</TableCell>
                <TableCell>{t("VOTE_NOW")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    {new Date(row.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{voteCounts[row.poll_id] || 0}</TableCell>
                  <TableCell>
                    <Box>
                      <Button
                        type="button"
                        className="custom-btn-primary ml-20"
                        onClick={() => handleClick(row.content_id)}
                      >
                        {t("VIEW_AND_VOTE")}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={totalRows}
          page={pageNumber}
          onChange={handleChange}
        />
      </Paper>
      <Footer />
    </>
  );
};

export default LernVotingList;
