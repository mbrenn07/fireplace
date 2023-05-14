import './App.css';
import '@fontsource/roboto/400.css';
import {
  Box, TextField, Button, Stack, Typography, CssBaseline, FormControl,
  FormLabel, Radio, RadioGroup, FormControlLabel, Grid, Avatar
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LinearWithValueLabel from './LinearProgressWithLabel';
import Plot from 'react-plotly.js';
import IconMenu from './IconMenu';
import druid from "./icons/druid.png";
import hunter from "./icons/hunter.png";
import mage from "./icons/mage.png";
import paladin from "./icons/paladin.png";
import priest from "./icons/priest.png";
import rogue from "./icons/rogue.png";
import shaman from "./icons/shaman.png";
import warlock from "./icons/warlock.png";
import warrior from "./icons/warrior.png";
import neutral from "./icons/neutral.png"

const App = () => {
  const MAX_CONSOLE_ITEMS = 500;
  const AGENT_TYPES = { "Ember": "Ember", "RandomAgent": "Random Agent", "EndTurnAgent": "End Turn Agent" };
  const CLASSES = {
    "Random": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Random"
      src={neutral}
    />,
    "Druid": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Druid"
      src={druid}
    />,
    "Hunter": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Hunter"
      src={hunter}
    />,
    "Mage": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Mage"
      src={mage}
    />,
    "Paladin": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Paladin"
      src={paladin}
    />,
    "Priest": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Priest"
      src={priest}
    />,
    "Rogue": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Rogue"
      src={rogue}
    />,
    "Shaman": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Shaman"
      src={shaman}
    />,
    "Warlock": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Warlock"
      src={warlock}
    />,
    "Warrior": <Avatar sx={{ mx: 1, marginLeft: "0px" }} alt="Warrior"
      src={warrior}
    />,
  };

  const [numGames, setNumGames] = useState(0);
  const [currentRunCap, setCurrentRunCap] = useState(0);
  const [currentRunProgress, setCurrentRunProgress] = useState(0);
  const [allActions, setAllActions] = useState([]);
  const [agentType1, setAgentType1] = useState(Object.keys(AGENT_TYPES)[0]);
  const [agentType2, setAgentType2] = useState(Object.keys(AGENT_TYPES)[0]);
  const [player1Losses, setPlayer1Losses] = useState(0);
  const [player2Losses, setPlayer2Losses] = useState(0);
  const [player1Class, setPlayer1Class] = useState(Object.keys(CLASSES)[0]);
  const [player2Class, setPlayer2Class] = useState(Object.keys(CLASSES)[0]);
  const [samplingTimes, setSamplingTimes] = useState([0]);
  const [player1WinData, setPlayer1WinData] = useState([50]);
  const [player2WinData, setPlayer2WinData] = useState([50]);

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
        if (url === "/newActions") {
          const readableActions = [];
          let numGamesPlayed = 0;
          data.data.forEach((element) => {
            if (element.formatted !== "Empty stack, refreshing auras and processing deaths") {
              readableActions.push(element.formatted);
            }
            if (element.message === "%r loses") {
              numGamesPlayed++;
              element.arguments.includes("Player1") ? setPlayer1Losses((oldLosses) => oldLosses + 1)
                : setPlayer2Losses((oldLosses) => oldLosses + 1);
            }
          });
          setAllActions((oldActions) => {
            if (readableActions.length === 0) {
              return oldActions;
            }
            const newCombinedActions = oldActions.concat(readableActions);
            if (newCombinedActions.length > MAX_CONSOLE_ITEMS) {
              return newCombinedActions.slice(-MAX_CONSOLE_ITEMS);
            }
            return newCombinedActions;
          });
          setCurrentRunProgress((oldProgress) => oldProgress + numGamesPlayed);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const runGames = () => {
    setCurrentRunCap(parseInt(numGames));
    setCurrentRunProgress(0);
    basicGetRequest("/runGames/" + numGames + "/" + agentType1 + "/" + agentType2 + "/" + player1Class + "/" + player2Class);
  }

  const getNewActions = () => {
    basicGetRequest("/newActions");
  }

  const purgeData = () => {
    setAgentType1(Object.keys(AGENT_TYPES)[0]);
    setAgentType2(Object.keys(AGENT_TYPES)[0]);
    setPlayer1Class(Object.keys(CLASSES)[0]);
    setPlayer2Class(Object.keys(CLASSES)[0]);
    setSamplingTimes([0]);
    setPlayer1WinData([50]);
    setPlayer2WinData([50]);
    setPlayer1Losses(0);
    setPlayer2Losses(0);
    setAllActions([]);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getNewActions();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (player1Losses + player2Losses != samplingTimes[samplingTimes.length - 1]) {
      setSamplingTimes((oldTimes) => {
        oldTimes.push(player1Losses + player2Losses);
        return oldTimes;
      });
      setPlayer1WinData((oldData) => {
        oldData.push((player2Losses * 100) / (player1Losses + player2Losses));
        console.log(oldData);
        return oldData;
      });
      setPlayer2WinData((oldData) => {
        oldData.push((player1Losses * 100) / (player1Losses + player2Losses));
        console.log(oldData);
        return oldData;
      });
    }
  }, [player1Losses, player2Losses])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ mt: 1 }}>
        <Stack>
          <Grid container wrap="nowrap" columns={8}>
            <Grid item xs={true}>
              <Stack sx={{ m: 1 }} direction={"row"} spacing={1}>
                <Button sx={{ height: "56px" }} variant="contained" onClick={runGames} disabled={currentRunProgress !== currentRunCap}> Simulate Games </Button>
                <TextField
                  id="numGames"
                  label="Num Games"
                  variant="outlined"
                  type="number"
                  value={numGames}
                  onChange={(e) => setNumGames(e.target.value)} />
                <Button sx={{ height: "56px" }} variant="contained" color="error" onClick={purgeData} disabled={currentRunProgress !== currentRunCap}> Reset Simulation </Button>
              </Stack>
              <LinearWithValueLabel variant="determinate" value={(currentRunProgress * 100) / currentRunCap} />
            </Grid>
            <Grid item xs={"auto"} sx={{ mr: 2, height: "100px" }}>
              <h1 style={{margin: 0, marginTop: -25, marginLeft: -275}}>Chimney</h1>
            </Grid>
          </Grid>
          <Grid container direction={"row"} columns={12} wrap='nowrap'>
            <Grid item xs={true} sx={{ overflow: "hide" }}>
              <Stack spacing={1}>
                <Stack direction={"row"}>
                  <Stack>
                    <FormControl>
                      <FormLabel id="agent1Selector">Agent 1 Model</FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={agentType1}
                        onChange={(e) => setAgentType1(e.target.value)}
                        name="radio-buttons-group"
                      >
                        {Object.keys(AGENT_TYPES).map((element) =>
                          <FormControlLabel key={element} value={element} control={<Radio />} label={AGENT_TYPES[element]} />)}
                      </RadioGroup>
                    </FormControl>
                    <IconMenu options={CLASSES} defaultOption={player1Class} setSelection={setPlayer1Class} title={"Agent 1 Class"} />
                  </Stack>
                  <Stack>
                    <FormControl>
                      <FormLabel id="agent2Selector">Agent 2 Model</FormLabel>
                      <RadioGroup
                        dir="row"
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={agentType2}
                        onChange={(e) => setAgentType2(e.target.value)}
                        name="radio-buttons-group2"
                      >
                        {Object.keys(AGENT_TYPES).map((element) =>
                          <FormControlLabel key={element} value={element} control={<Radio />} label={AGENT_TYPES[element]} />)}
                      </RadioGroup>
                    </FormControl>
                    <IconMenu options={CLASSES} defaultOption={player2Class} setSelection={setPlayer2Class} title={"Agent 2 Class"} />
                  </Stack>
                </Stack>
                <Plot
                  data={[
                    {
                      values: [player2Losses, player1Losses],
                      labels: ["Player 1 Winrate", "Player 2 Winrate"],
                      type: "pie",
                    },
                  ]}
                  layout={{ height: 260, width: 600, title: 'Aggregate Model Winrate', legend: { orientation: 'h', side: 'top' } }}
                />
                <Plot
                  data={[
                    {
                      name: "Player 1 Winrate",
                      x: [...samplingTimes],
                      y: player1WinData,
                      type: 'scatter',
                      mode: 'lines+markers',
                    },
                    {
                      name: "Player 2 Winrate",
                      x: [...samplingTimes],
                      y: player2WinData,
                      type: 'scatter',
                      mode: 'lines+markers',
                    },
                  ]}
                  layout={{ height: 260, width: 600, title: 'Model Winrate over Time', legend: { orientation: 'h', side: 'top' } }}
                />
              </Stack>
            </Grid>
            <Grid item xs={9}>
              <Box sx={{ height: "752px", width: "95%", backgroundColor: "grey", margin: "auto", mt: 1, overflow: "auto" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {currentRunCap === currentRunProgress && (
                    <Box sx={{ borderRadius: "5px", backgroundColor: "orange" }}>
                      <Typography variant="h4" sx={{ m: 1 }}>Simulation currently inactive</Typography>
                    </Box>
                  )}
                  {currentRunProgress === 0 && currentRunCap !== currentRunProgress && (
                    <Box sx={{ borderRadius: "5px", backgroundColor: "green" }}>
                      <Typography variant="h4" sx={{ m: 1 }}>Initializing</Typography>
                    </Box>
                  )}
                </Box>
                <Stack>
                  {allActions.map((action) => {
                    if (action === "Game completed normally.") {
                      return (
                        <Box key={action} sx={{ m: 1, display: "flex", alignItems: "right", justifyContent: "right" }}>
                          <Typography sx={{ color: "#7feb9b" }} variant="h3">Game Completed</Typography>
                        </Box>
                      )
                    }
                    return <Typography key={action} variant="body1">{action}</Typography>
                  })}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
