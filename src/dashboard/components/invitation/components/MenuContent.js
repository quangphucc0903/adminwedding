import * as React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { QuestionMarkRounded } from "@mui/icons-material";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, link: "/dashboard" },
  // { text: 'Analytics', icon: <AnalyticsRoundedIcon />, link: '/analytics' },
  { text: "Users", icon: <PeopleRoundedIcon />, link: "/clients" }, // Đường dẫn đúng
  // { text: 'Tasks', icon: <AssignmentRoundedIcon />, link: '/tasks' },
  // { text: 'Questions', icon: <QuestionMarkRounded />, link: '/question' },
  { text: "Orders", icon: <AssignmentRoundedIcon />, link: "/order" },
  { text: "Template", icon: <AssignmentRoundedIcon />, link: "/template" },
  {
    text: "Subscription Plans",
    icon: <AssignmentRoundedIcon />,
    link: "/subscription_plans",
  },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, link: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, link: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, link: "/feedback" },
];

export default function MenuContent() {
  const location = useLocation(); // Lấy thông tin về URL hiện tại

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      {/* Danh sách chính */}
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.link}
              selected={location.pathname === item.link}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Danh sách phụ */}
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.link}
              selected={location.pathname === item.link}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
