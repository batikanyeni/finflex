import Paper from "@mui/material/Paper";
import React, {useState} from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Alert, Checkbox, FormControlLabel, FormGroup} from "@mui/material";

const CustomerSearch = (props) => {
    const [value, setValue] = useState('1');
    const [checked, setChecked] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setChecked(false);
    };

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    return(
        <React.Fragment>
            <Alert severity="info">Müşteri aramak için aşağıdaki alanları kullanın.</Alert>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                    marginTop: 5
                }}
            >
                <Box sx={{width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider',display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <TabList variant={"scrollable"} onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="TCKN/YKN İLE ARA" value="1" />
                                <Tab label="VKN İLE ARA" value="2" />
                                <Tab label="MÜŞTERİ NUMARASI İLE ARA" value="3" />
                            </TabList>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <TabPanel value="1">
                                <FormGroup sx={{display: 'flex', flexDirection:'column' }}>
                                    <TextField
                                        id="standard-search"
                                        required
                                        label={checked ? 'YKN' : 'TCKN'}
                                        type="search"
                                        variant="standard"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange}/>} label="Yabancı Kimlik" />
                                    <Button onClick={() => props.searchButtonClick(value, searchValue, checked)} sx={{mt:4}} variant="outlined">ARA</Button>
                                </FormGroup>

                            </TabPanel>
                            <TabPanel value="2">
                                <FormGroup sx={{display: 'flex', flexDirection:'column' }}>
                                    <TextField
                                        id="standard-search"
                                        required
                                        label="VKN"
                                        type="search"
                                        variant="standard"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                    <Button onClick={() => props.searchButtonClick(value, searchValue, checked)} sx={{mt:4}} variant="outlined">ARA</Button>
                                </FormGroup>
                            </TabPanel>
                            <TabPanel value="3">
                                <FormGroup sx={{display: 'flex', flexDirection:'column' }}>
                                    <TextField
                                        id="standard-search"
                                        required
                                        label="Müşteri No"
                                        type="search"
                                        variant="standard"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                    <Button onClick={() => props.searchButtonClick(value, searchValue, checked)} sx={{mt:4}} variant="outlined">ARA</Button>

                                </FormGroup>

                            </TabPanel>
                        </Box>
                    </TabContext>
                </Box>
            </Paper>
        </React.Fragment>
    )
}

export default CustomerSearch;