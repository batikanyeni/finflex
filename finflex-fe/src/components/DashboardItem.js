import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import classes from './DashboardItem.module.css'
const DashboardItem = ({ onClick, title }) => {
  return (
    <Grid item>
      <Box
        height={120}
        width={220}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow={4.0}
        borderRadius={4.0}
        letterSpacing={1}
        fontWeight={800}
        p={2}
        sx={{backgroundColor:'#185a65',color:'#FFFFFF', border: '2px solid #021526', cursor: 'pointer'}}
        onClick={onClick}
        className = {classes['dashboard-item']}
      >
        {title}
      </Box>
    </Grid>
  );
};

export default DashboardItem;
