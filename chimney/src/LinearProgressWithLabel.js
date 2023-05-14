import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress sx={{height: "10px"}} variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35, mr: 2 }}>
                <Typography variant="body2" color="text.secondary">{(isNaN(props.value) ? 0 : props.value) + "%"}</Typography>
            </Box>
        </Box>
    );
}