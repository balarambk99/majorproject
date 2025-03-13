
import { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import axios from 'axios';
import {BASE_URL} from '../../../../helper'
import { Button } from '@mui/material';


const NewCandidates = () => {

    const token=localStorage.getItem("authToken");
    const [theme, colorMode] = useMode();
    const [candidate, setCandidate] = useState([]);
    const colors = tokens(theme.palette.mode);
    const columns = [
        {
            field: "img",
            headerName: "PHOTO",
            renderCell: ({ row: { img } }) => {
                return (
                    <Box
                        width="100%" height="100%"
    
                        m="0 auto"
                        p="0px"
                        display="flex"
                        justifyContent="center"      
                    >
                    <img src={img} alt={img}
                   
                    
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Cover the entire box
                        // Optional: Make it circular
                    }} 
                    ></img>
                    </Box>
                );
            },
        },
        {
            field: "fullName",
            headerName: "CANDIDATE NAME",
            cellClassName: "name-column--cell",
        },
        {
            field: "bio",
            headerName: "CANDIDATE BIO",
            cellClassName: "name-column--cell",
            // flex:1
        },
        {
            field: "party",
            headerName: "PARTY",
            cellClassName: "name-column--cell",
        },
        {
            field: "age",
            headerName: "AGE",
            type: "number",
            headerAlign: "left",
            align: "left",
        },
        {
            headerName: "ACTION",
            flex: 1,
            renderCell: ({ row: { _id } }) => {
                return (
                    <Box>
                        <span id='edit' className='Button-span'><Button variant="contained" sx={{ backgroundColor: colors.blueAccent[600], color: 'white', marginRight: 2 }}>Edit</Button></span>
                        <span id='delete' className='Button-span'><Button variant="contained" sx={{ backgroundColor: colors.redAccent[600], color: 'white', marginRight: 2 }} onClick={()=>deleteCandidate(_id)}>Delete</Button></span>
                    </Box>
                );
            },
        },
    ];
    
    const deleteCandidate = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/admin/deleteCandidate/${id}`,{
                headers: { 
                    "Authorization": `Bearer ${token}` // Attach the token in headers
                }});
            setCandidate(candidate.filter(candidate => candidate._id !== id));
        } catch (error) {
            console.error('Error deleting candidate', error);
        }
    };
    useEffect(() => {
        axios.get(`${BASE_URL}/admin/getCandidate`, {
            headers: {
                "Authorization": `Bearer ${token}` // Attach the token in headers
            }
        }).then((response) => {
            const modifiedCandidates = response.data.candidate.map(c => ({
                ...c,
                img: c.image?`${c.image}`:'ah', // Convert Base64 to Image URL
                symbol: c.symbol?`${c.symbol}`:'kjkj', // Convert Base64 to Image URL
            }));
            setCandidate(modifiedCandidates);
        }).catch(err => console.error("Error fetching data: ", err));
    }, []);
    
    return (<ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="appNew">
                <Sidebar />
                <main className="content">
                    <Topbar />
                    <Box m="0px 20px">
                        <Header title="CANDIDATES INFORMATION" subtitle="Managing the Candidates" />
                        <Box
                            m="20px 0 0 0"
                            height="70vh"
                            // width="160vh"
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none",
                                },
                                "& .name-column--cell": {
                                    color: colors.greenAccent[300],
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: colors.blueAccent[700],
                                    borderBottom: "none",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: colors.primary[400],
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    borderTop: "none",
                                    backgroundColor: colors.blueAccent[700],
                                },
                                "& .MuiCheckbox-root": {
                                    color: `${colors.greenAccent[200]} !important`,
                                },
                            }}
                        >
                            <DataGrid rows={candidate} columns={columns} getRowId={(row) => row._id} />
                        </Box>
                    </Box>
                </main>
            </div>
        </ThemeProvider>
    </ColorModeContext.Provider>

    )

};

export default NewCandidates;
