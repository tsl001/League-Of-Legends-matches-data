"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import psfStyles from "../css/PlayerSearchForm.module.css"

const theme = createTheme({
    palette: {
      primary: {
        main: '#03a9f4',
      },
      secondary: {
        main: '#ff1744'
      },
    },
});

export default function PlayerSearchForm(){
    const [searchSummoner, setSearchSummoner] = useState<string>('')
    const router = useRouter();

    return (
        <>
            <ThemeProvider theme={theme}>
                <Stack direction="column" spacing={2} className={psfStyles['stack']}>
                    <TextField 
                        id="summoner-name-textfield"
                        // sx={{color: "white"}}//input: {color: 'white'}
                        InputLabelProps={{
                            style: {
                                color: 'black',
                                fontWeight: 'bold'
                            }
                        }}
                        InputProps={{
                            style: {
                                color: 'black',
                                backgroundColor: 'white',
                            }
                        }}
                        label="Summoner Name"
                        variant="filled"
                        size="large"
                        value={searchSummoner}
                        onChange={(e) => setSearchSummoner(e.target.value)}
                        className={`${psfStyles['textfield']}`}/>
                    
                    <Button variant="contained" size="small" onClick={() => router.push(`/summoners/${searchSummoner}`)} 
                            className={`${psfStyles['btn']}`}>
                        Search for summoner</Button>
                </Stack>
            </ThemeProvider>
        </>
    );
}