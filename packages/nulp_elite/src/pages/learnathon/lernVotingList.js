import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
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

const LernVotingList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [pollData, setPollData] = useState([]);
  const [voteCounts, setVoteCounts] = useState({}); // Object to store vote counts

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, search]);

  const fetchData = async () => {
    const assetBody = {
      request: {
        filters: {
          category: "Learnathon",
          status: ["Live"],
        },

        limit: rowsPerPage,
        offset: page * rowsPerPage,
        search: search,
      },
    };
    try {
      const response = await fetch("/polls/list", {
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
      setTotalRows(result.result.totalCount);

      // Fetch vote counts for each poll
      getVoteCounts(pollIds);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const getVoteCounts = async (pollIds) => {
    try {
      const url = "/polls/all/get_poll";
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (poll_id) => {
    navigate(`/webapp/pollDetails?${poll_id}`);
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
          <Typography variant="h6">Learnathon Votting List</Typography>
        </Box>

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
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Submission Name</TableCell>
                <TableCell>Voting Deadline</TableCell>
                <TableCell>Vote Count</TableCell>
                <TableCell>Vote Now</TableCell>
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
                    <img
                      src={require("assets/votting.png")}
                      alt="Voting"
                      style={{
                        width: "108px",
                        height: "42px",
                      }}
                      onClick={() => handleClick(row.poll_id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
      <Footer />
    </>
  );
};

export default LernVotingList;