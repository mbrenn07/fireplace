import './App.css';
import '@fontsource/roboto/400.css';
import { Box, TextField, Button, Stack, Typography, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LinearWithValueLabel from './LinearProgressWithLabel';

const App = () => {
  const [numGames, setNumGames] = useState(0);
  const [currentRunCap, setCurrentRunCap] = useState(0);
  const [currentRunProgress, setCurrentRunProgress] = useState(0);
  const [allActions, setAllActions] = useState([]);

  const MAX_CONSOLE_ITEMS = 10000;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const baseInstance = axios.create({
    baseURL: "http://localhost:8000/",
    timeout: undefined
  });

  const basicGetRequest = (url) => {
    baseInstance.get(url)
      .then((data) => {
        if (url === "/newGames") {
          setCurrentRunProgress((oldProgress) => oldProgress + data.data.length);
        }
        if (url === "/newActions") {
          const readableActions = [];
          data.data.forEach((element) => {
            if (element.formatted !== "Empty stack, refreshing auras and processing deaths") {
              readableActions.push(element.formatted);
            }
          });
          setAllActions((oldActions) => {
            if (readableActions.length === 0){
              return oldActions;
            }
            const newCombinedActions = oldActions.concat(readableActions);
            if (newCombinedActions.length > MAX_CONSOLE_ITEMS) {
              return newCombinedActions.slice(-MAX_CONSOLE_ITEMS);
            }
            return newCombinedActions;
          });
        }
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const runGames = () => {
    setCurrentRunCap(parseInt(numGames));
    setCurrentRunProgress(0);
    basicGetRequest("/runGames/" + numGames);
  }

  const getNewGames = async () => {
    basicGetRequest("/newGames");
  }

  const getNewActions = () => {
    basicGetRequest("/newActions");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getNewGames();
      getNewActions();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ mt: 1 }}>
        <Stack>
          <Stack sx={{ mt: 1 }} direction={"row"} spacing={1}>
            <Button variant="contained" onClick={runGames} disabled={currentRunProgress !== currentRunCap}> Simulate Games </Button>
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
          <LinearWithValueLabel variant="determinate" value={(currentRunProgress * 100) / currentRunCap} />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {currentRunCap === currentRunProgress && (
              <Box sx={{ outline: "solid 2px black", borderRadius: "5px", backgroundColor: "orange" }}>
                <Typography variant="h4" sx={{ m: 1 }}>Simulation currently inactive</Typography>
              </Box>
            )}
            {currentRunProgress === 0 && currentRunCap !== currentRunProgress && (
              <Box sx={{ outline: "solid 2px black", borderRadius: "5px", backgroundColor: "green" }}>
                <Typography variant="h4" sx={{ m: 1 }}>Initializing</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ height: "80vh", width: "90%", backgroundColor: "grey", margin: "auto", mt: 1, overflow: "auto" }}>
            <Stack>
              {allActions.map((action) => {
                if (action === "Game completed normally.") {
                  return (
                    <Box key={action} sx={{m: 1, display: "flex", alignItems: "right", justifyContent: "right"}}>
                      <Typography sx={{ color: "#7feb9b" }} variant="h3">Game Completed</Typography>
                    </Box>
                  )
                }
                return <Typography key={action} variant="body1">{action}</Typography>
              })}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
