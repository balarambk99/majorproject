import { useState, useEffect } from 'react';
import { Box, Typography, useTheme, CssBaseline, ThemeProvider, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { ColorModeContext, useMode } from "../../theme";
import axios from 'axios';
import { BASE_URL } from '../../../../helper';
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";

const Team = () => {
    const token = localStorage.getItem("authToken");
    const [theme, colorMode] = useMode();
    const [voters, setVoters] = useState([]);
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const fetchVoters = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/getVoter`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("API Response:", response.data); // Debugging
                setVoters(response.data.voters || []); // ✅ Ensure it is an array
            } catch (error) {
                console.error("Error fetching voters:", error);
            }
        };
        fetchVoters();
    }, [token]);

    const deleteVoter = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this voter?");
            if (!confirmDelete) return;
                 alert("hwlleo")
            await axios.delete(`${BASE_URL}admin/deleteVoter/${id}`, { // ✅ Admin deletes voter
                headers: { Authorization: `Bearer ${token}` }
            });

            setVoters((prevVoters) => prevVoters.filter((voter) => voter.voterid !== id));
        } catch (error) {
            console.error('Error deleting voter:', error);
        }
    };

    const columns = [
        {
            field: "image",
            headerName: "PHOTO",
            width: 100,
            renderCell: ({ row }) => (
                <Box display="flex" justifyContent="center">
                   <img 
                        src={row.image || "https://via.placeholder.com/50"} 
                        alt="Voter" 
                        width="100%" 
                        height="100%"
                        
                    />
                </Box>
            ),
        },
        { field: "firstName", headerName: "FIRST NAME", width: 150 },
        { field: "lastName", headerName: "LAST NAME", width: 150 },
        { field: "age", headerName: "AGE", type: "number", width: 80 },
        { field: "phone", headerName: "PHONE", width: 150 },
        { field: "voterid", headerName: "VOTER ID", width: 150 },
        { field: "email", headerName: "EMAIL", width: 200 },
        {
            headerName: "ACTION",
            width: 200,
            renderCell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <Button variant="contained" sx={{ backgroundColor: colors.blueAccent[600], color: 'white' }}>
                        Edit
                    </Button>
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: colors.redAccent[600], color: 'white' }} 
                        onClick={() => deleteVoter(row.voterid)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="appNew">
                    <Sidebar />
                    <main className="content">
                        <Topbar />
                        <Box m="20px">
                            <Header title="VOTERS" subtitle="Managing the Voters" />
                            <Box
                                m="20px 0"
                                height="70vh"
                                sx={{
                                    "& .MuiDataGrid-root": { border: "none" },
                                    "& .MuiDataGrid-cell": { borderBottom: "none" },
                                    "& .MuiDataGrid-columnHeaders": {
                                        backgroundColor: colors.blueAccent[700],
                                    },
                                    "& .MuiDataGrid-virtualScroller": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiDataGrid-footerContainer": {
                                        backgroundColor: colors.blueAccent[700],
                                    },
                                    "& .MuiCheckbox-root": {
                                        color: `${colors.greenAccent[200]} !important`,
                                    },
                                }}
                            >
                                <DataGrid 
                                    rows={voters} 
                                    columns={columns} 
                                    getRowId={(row) => row.voterid || row._id} // ✅ Fixed ID reference
                                    pageSize={5}
                                />
                            </Box>
                        </Box>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default Team;
