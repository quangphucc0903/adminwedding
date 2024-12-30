import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './components/CustomDatePicker';
import MenuButton from './components/MenuButton';


import Search from './components/Search';

export default function Headerv2() {
  return (
    <Stack
      direction='row'
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'flex-end',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1,
        borderBottom: "1px solid #ddd",
        pb: 1,
        pr: 3,
        backgroundColor: 'var(--template-palette-background-paper)'
      }}
      spacing={2}
    >
      {/* <NavbarBreadcrumbs /> */}
      <Stack direction='row' sx={{ gap: 1 }}>
        <Search />
        <CustomDatePicker />
        <MenuButton showBadge aria-label='Open notifications'>
          <NotificationsRoundedIcon />
        </MenuButton>
          {/* <ColorModeIconDropdown /> */}
      </Stack>
    </Stack>
  );
}
