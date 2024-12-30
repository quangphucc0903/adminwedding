import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router-dom';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();

  // Lấy phần cuối của đường dẫn làm breadcrumb
  const breadcrumbText =
    location.pathname
      .split('/')
      .filter(Boolean) // Loại bỏ phần rỗng
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)) // Chuyển chữ cái đầu thành chữ hoa
      .join(' > ') || 'Home';

  return (
    <StyledBreadcrumbs
      aria-label='breadcrumb'
      separator={<NavigateNextRoundedIcon fontSize='small' />}
    >
      <Typography variant='body1'>Dashboard</Typography>
      <Typography
        variant='body1'
        sx={{ color: 'text.primary', fontWeight: 600 }}
      >
        {breadcrumbText}
      </Typography>
    </StyledBreadcrumbs>
  );
}
