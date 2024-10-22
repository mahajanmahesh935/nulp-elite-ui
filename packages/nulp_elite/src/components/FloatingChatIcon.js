import React, { useState } from "react";
import { Popover, Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { t } from "i18next";

const useStyles = makeStyles((theme) => ({
  link: {
    position: "fixed",
    bottom: 0,
    right: 0,
    zIndex: 999,
    background: "blue", // Ensures the icon appears above other elements
  },
}));

const FloatingChatIcon = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "chat-popover" : undefined;

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <iframe
          src="https://devnulp.niua.org/chatbot"
          width="350"
          height="500"
          title="ChatBot"
        />
      </Popover>
      <Tooltip title={t("NULP_ASSIST")} placement="left">
      <Link
        onClick={handleOpenPopover}
        color="primary"
        aria-label="chat"
        className="chatIcon"
      >
        <HeadsetMicOutlinedIcon
          style={{
            paddingRight: "8px",
            borderRadius: "50%",
            width: "30px", // Adjust the size as needed
            height: "3  2px", // Adjust the size as needed
          }}
        />
        
      </Link>
      </Tooltip>
    </>
  );
};

export default FloatingChatIcon;
