import { useRef, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow 
} from '@mui/material';

import './Ladder.css';

const Ladder: React.FC<undefined> = () => {

    function mockData(
        rank: number,
        pseudo: string,
        wins: number,
        losses: number,
        status: string
    ) {
        return { rank, pseudo, wins, losses, status };
    }
    
    const rows = [
        mockData(1, 'ycurbill', 15, 0, ''),
        mockData(2, 'nul1', 9, 2, 'Add'),
        mockData(3, 'nul2', 9, 3, 'Playing'),
        mockData(4, 'nul3', 5, 1, 'Online'),
        mockData(5, 'nul4', 4, 5, 'Add'),
        mockData(6, 'nul5', 4, 5, 'Add'),
    ];

    const tableBodyRef = useRef<HTMLTableSectionElement>(null);
    const firstRowRef = useRef<HTMLTableRowElement>(null);

    useEffect(() => {
        const currentDiv = tableBodyRef.current;
        const currentFirstRow = firstRowRef.current;
        const handleScroll = () => {
            console.log(currentDiv!.scrollTop)
            if (currentDiv!.scrollTop > 0) {
                currentFirstRow!.style.borderBottom = "5px solid #F8A38B";
            } else {
                currentFirstRow!.style.borderBottom = "2px solid #F8A38B";
            }
        };

        
        if (currentDiv) {
            currentDiv.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (currentDiv) {
                currentDiv.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    return (
        <div className="ladder">
            <TableContainer 
                sx={{
                    backgroundColor: '#D9D9D9',
                    borderRadius: '10px',
                    borderLeft: '5px solid #9747FF',
                    borderBottom: '5px solid #9747FF',
                    boxShadow: '2px 1px 20px #9747FF',
                }}
            >
                <Table sx={{ minWidth: 300, maxWidth: 600 }} aria-label="simple table">
                {/* <Scroll> */}
                    <TableHead>
                        <TableRow
                            sx={{
                                display: 'table',
                                width: '100%',
                                tableLayout: 'fixed',
                            }}
                            ref={firstRowRef}
                        >
                            <TableCell sx={{ borderBottom: '2px solid #F8A38B' }}>{rows[0].rank}</TableCell>
                            <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{rows[0].pseudo}</TableCell>
                            <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{rows[0].wins} wins</TableCell>
                            <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{rows[0].losses} losses</TableCell>
                            <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{rows[0].status}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody 
                        sx={{
                            display: 'block',
                            maxHeight: '200px',
                            overflowY: 'auto',
                        }}
                        ref={tableBodyRef}
                    >
                            {rows.slice(1).map((row) => (
                                <TableRow
                                    key={row.pseudo}
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        display: 'table',
                                        width: '100%',
                                        tableLayout: 'fixed',
                                    }}
                                >
                                    <TableCell sx={{ borderBottom: '2px solid #F8A38B' }}>{row.rank}</TableCell>
                                    <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{row.pseudo}</TableCell>
                                    <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{row.wins} wins</TableCell>
                                    <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{row.losses} losses</TableCell>
                                    <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{row.status}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    {/* </Scroll> */}
                </Table>
            </TableContainer>
        </div>
    )
};

export default Ladder;


// TODO: 