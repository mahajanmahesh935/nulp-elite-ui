import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  Button,
} from "@mui/material";
import Select from "react-select";
import axios from "axios";
const userData = require("../assets/userData.json");
import * as util from "../services/utilService";
const urlConfig = require("../configs/urlConfig.json");
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
};

const PopupForm = ({ open, handleClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [bio, setBio] = useState("");
  const [designation, setDesignation] = useState("");
  const [userType, setUserType] = useState("");
  const [designations, setDesignations] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [customDesignation, setCustomDesignation] = useState("");
  const [customUserType, setCustomUserType] = useState("");
  const _userId = util.userId();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const maxChars = 500;
  const { t } = useTranslation();

  useEffect(() => {
    const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.GET_PROFILE}${_userId}`;
    axios
      .get(url)
      .then((response) => {
        const userData = response.data?.result?.response;
        const fName = userData?.firstName || "";
        const lName = userData?.lastName || "";

        setFirstName(fName);
        setLastName(lName);

        setInitialFirstName(fName);
        setInitialLastName(lName);
      })
      .catch((error) => console.error("Error fetching user names:", error));

    axios
      .get(`${urlConfig.URLS.POFILE_PAGE.USER_READ}`)
      .then((response) => {
        const userInfo = response.data?.result?.[0];
        setBio(userInfo?.bio || "");
        setDesignation(userInfo?.designation || "");
        setUserType(userInfo?.user_type || "");
        setOrganisation(userInfo?.organisation || "");
      })
      .catch((error) => console.error("Error fetching user info:", error));

    setDesignations([
      ...userData.designations.map((type) => ({ value: type, label: type })),
      { value: "other", label: "Other" },
    ]);
    setUserTypes([
      ...userData.userTypes.map((type) => ({ value: type, label: type })),
      { value: "other", label: "Other" },
    ]);
  }, []);

  useEffect(() => {
    if (firstName && lastName && organisation && designation && userType) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [firstName, lastName, organisation, designation, userType]);

  const handleSubmit = async () => {
    const finalDesignation =
      designation === "other" ? customDesignation : designation;
    const finalUserType = userType === "other" ? customUserType : userType;

    const requestData = {
      organisation: organisation,
      designation: finalDesignation,
      user_type: finalUserType,
      bio: bio,
    };

    try {
      const updateNameUrl = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.UPDATE_USER_PROFILE}`;
      const updateUserInfoUrl = `${urlConfig.URLS.POFILE_PAGE.USER_UPDATE}?user_id=${_userId}`;

      if (firstName !== initialFirstName || lastName !== initialLastName) {
        await axios.patch(updateNameUrl, {
          request: { firstName, lastName, userId: _userId },
        });
      }

      // Update other user info
      const response = await axios.put(updateUserInfoUrl, requestData);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("API Error:", error);
    }

    handleClose();
  };

   const handleBioChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setBio(e.target.value);
    }
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          handleClose();
        }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" className="h4-title mb-20">
          User Information
        </Typography>
        <Box>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Organization"
            type="text"
            fullWidth
            required
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Bio"
            type="text"
            fullWidth
            value={bio}
            onChange={handleBioChange}
            inputProps={{ maxLength: maxChars }}
          />
          <Typography variant="body2" color="textSecondary">
            {bio.length}/{maxChars}
          </Typography>
          <FormControl fullWidth margin="dense">
            <Select
              options={designations}
              value={designations.find(
                (option) => option.value === designation
              )}
              onChange={(selectedOption) =>
                setDesignation(selectedOption.value)
              }
              placeholder="Select Designation *"
              isClearable
            />
            {designation === "other" && (
              <TextField
                margin="dense"
                label="Enter Custom Designation"
                type="text"
                fullWidth
                value={customDesignation}
                onChange={(e) => setCustomDesignation(e.target.value)}
              />
            )}
          </FormControl>
          <FormControl fullWidth margin="dense">
            <Select
              options={userTypes}
              value={userTypes.find((option) => option.value === userType)}
              onChange={(selectedOption) => setUserType(selectedOption.value)}
              placeholder="Select User Type *"
              isClearable
            />
            {userType === "other" && (
              <TextField
                margin="dense"
                label="Enter Custom User Type"
                type="text"
                fullWidth
                value={customUserType}
                onChange={(e) => setCustomUserType(e.target.value)}
              />
            )}
          </FormControl>
        </Box>

        <Box pt={4} className="d-flex jc-en">
          <Button
            onClick={handleSubmit}
            className="custom-btn-primary "
            disabled={isSubmitDisabled}
          >
            {t("SUBMIT")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PopupForm;
