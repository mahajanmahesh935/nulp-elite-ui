// Profile.js

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Footer from "components/Footer";
import Header from "components/header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import data from "../../assets/certificates.json";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Card from "@mui/material/Card";
import * as util from "../../services/utilService";
import axios from "axios";

const Certificate = () => {
  const { t } = useTranslation();
  const [certData, setCertData] = useState(null);
  const [otherCertData, setOtherCertData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _userId = util.userId();
        const request = {
          request: {
            _source: [
              "data.badge.issuer.name",
              "pdfUrl",
              "data.issuedOn",
              "data.badge.name",
            ],
            query: {
              bool: {
                must: [
                  {
                    match_phrase: {
                      "recipient.id": _userId,
                    },
                  },
                ],
              },
            },
          },
        };
        const url = `http://localhost:3000/learner/certreg/v2/certs/search`;
        const response = await axios.post(url, request);
        const data = response.data;
        setCertData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      try {
        const _userId = util.userId();
        const request = {
          filters: {
            recipient: { id: { eq: _userId } },
          },
        };
        const url = `http://localhost:3000/learner/rc/certificate/v1/search`;
        // const header = "application/json";
        const response = await axios.post(url, request);
        const data = response.data;
        console.log(data);
        setOtherCertData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <Header />
      <Container maxWidth="xxl" role="main" className="container-pb">
        <Box textAlign="center" padding="10">
          <Breadcrumbs
            aria-label="breadcrumb"
            style={{
              padding: "25px 0",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            <Link underline="hover" color="#004367" href="/">
              {t("MY_PROFILE")}
            </Link>
            <Link underline="hover" href="" aria-current="page" color="#484848">
              {t("CERTIFICATES")}
            </Link>
          </Breadcrumbs>
          <Card style={{ padding: "20px", textAlign: "left" }}>
            <Box style={{ display: "flex", alignItems: "end" }}>
              <DescriptionOutlinedIcon /> {t("CERTIFICATES")}
            </Box>
            <Grid
              container
              spacing={2}
              style={{ textAlign: "left", paddingTop: "10px" }}
            >
              {certData &&
                certData.result.response.content &&
                certData.result.response.content.map((certificate) => (
                  <Grid item xs={12} md={4} key={certificate._id}>
                    <Card
                      sx={{
                        marginTop: "10px",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "solid 1px #EFEFEF",
                        boxShadow: "none",
                        color: "#484848",
                      }}
                    >
                      <Typography
                        className="twoLineEllipsis"
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                        style={{
                          fontSize: "14px",
                          paddingBottom: "15px",
                          height: "42px",
                          fontWeight: "600",
                        }}
                      >
                        {certificate._source.data.badge.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                        style={{ fontSize: "12px" }}
                      >
                        {t("CERTIFICATE_GIVEN_BY")}:{" "}
                        {certificate._source.data.badge.issuer.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                        style={{ fontSize: "12px" }}
                      >
                        {t("CERTIFICATE_ISSUE_DATE")}:{" "}
                        {certificate._source.data.issuedOn}
                      </Typography>
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "end",
                          color: "#1976d2",
                        }}
                      >
                        <SimCardDownloadOutlinedIcon />
                        <Link
                          href={certificate._source.pdfUrl} // Corrected usage of pdfUrl
                          underline="none"
                          style={{
                            fontSize: "12px",
                            marginTop: "15px",
                            display: "block",
                          }}
                          key={certificate._id} // Add key prop
                        >
                          {t("CERTIFICATES")}
                        </Link>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              {otherCertData.map((certificate) => (
                <Grid item xs={12} md={4} key={certificate.osid}>
                  <Card
                    sx={{
                      marginTop: "10px",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "solid 1px #EFEFEF",
                      boxShadow: "none",
                      color: "#484848",
                    }}
                  >
                    <Typography
                      className="twoLineEllipsis"
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                      style={{
                        fontSize: "14px",
                        paddingBottom: "15px",
                        height: "42px",
                        fontWeight: "600",
                      }}
                    >
                      {certificate.training.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                      style={{ fontSize: "12px" }}
                    >
                      {t("CERTIFICATE_GIVEN_BY")}: {certificate.issuer.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                      style={{ fontSize: "12px" }}
                    >
                      {t("CERTIFICATE_ISSUE_DATE")}: {certificate.osCreatedAt}
                    </Typography>
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "end",
                        color: "#1976d2",
                      }}
                    >
                      <SimCardDownloadOutlinedIcon />
                      <Link
                        href={certificate.pdfUrl} // Corrected usage of pdfUrl
                        underline="none"
                        style={{
                          fontSize: "12px",
                          marginTop: "15px",
                          display: "block",
                        }}
                        key={certificate.osid} // Add key prop
                      >
                        {t("CERTIFICATES")}
                      </Link>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default Certificate;
