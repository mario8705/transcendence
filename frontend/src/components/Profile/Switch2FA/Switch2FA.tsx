import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

const Switch2FA: React.FC = () => {
    return (
        <FormControlLabel 
            control={
                <Switch 
                    defaultChecked 
                    sx={{
                        color: '#32CD32',
                        '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#32CD32',
                            '&:hover': {
                            backgroundColor: 'rgba(50, 205, 50, 0.08)',
                            },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#32CD32',
                        },
                    }}
                />
            }
            label="2FA" 
            sx={{
                color: "white",
            }}
        />
    )
};

export default Switch2FA;