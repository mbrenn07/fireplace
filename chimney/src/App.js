import './App.css';
import { Box, TextField, Button, Stack } from "@mui/material";
import { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [numGames, setNumGames] = useState(0);

  const baseInstance = axios.create({
    baseURL: "http://localhost:8000/",
    timeout: undefined
  });

  const basicGetRequest = (url) => {
    baseInstance.get(url)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const runGames = () => {
    basicGetRequest("/runGames/" + numGames);
  }

  const getNewGames = () => {
    basicGetRequest("/newGames");
  }

  const getNewActions = () => {
    basicGetRequest("/newActions");
  }

  return (
    <Box>
      <Stack sx={{ m: 1 }} direction={"row"} spacing={1}>
        <Button variant="contained" onClick={runGames}> Simulate Games </Button>
        <TextField
          id="numGames"
          label="Num Games"
          variant="outlined"
          type="number"
          value={numGames}
          onChange={(e) => setNumGames(e.target.value)} />
        <Button variant="contained" onClick={getNewGames}> Get New Games </Button>
        <Button variant="contained" onClick={getNewActions}> Get New Actions </Button>
      </Stack>
    </Box>
  );
}

export default App;
