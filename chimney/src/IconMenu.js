import { Button, Menu, MenuItem, Box, Stack, FormLabel, Typography } from "@mui/material";
import { useState } from "react";

const IconMenu = (props) => {
    const { defaultOption, options, setSelection, title } = props;

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    return (
        <Stack>
            <FormLabel sx={{ mt: 1 }} id="title">{title}</FormLabel>
            <Button
                sx={{ display: "flex", justifyContent: "left", padding: "2px 0px 2px 0px" }}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <Box sx={{ display: "flex", alignItems: "right", justifyContent: "right" }}>
                    {options[defaultOption]}
                    <Box sx={{my: 1}}>
                        {defaultOption}
                    </Box>
                </Box>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {Object.keys(options).map((key) =>
                    <MenuItem key={key} onClick={() => {
                        setAnchorEl(null)
                        setSelection(key)
                    }}>
                        {options[key]}
                        {key}
                    </MenuItem>
                )}
            </Menu>
        </Stack>
    );

}

export default IconMenu;