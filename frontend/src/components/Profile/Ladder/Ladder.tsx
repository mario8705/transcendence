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

    interface CellStyle {
        color: string,
        fontSize: string,
        fontWeight: number,
    }

    const rankNumberStyles = (index: number): CellStyle => {
        if (index === 0) {
            return { color: 'silver', fontSize: '1.6em', fontWeight: 700 };
          } else if (index === 1) {
            return { color: '#CD7F32', fontSize: '1.4em', fontWeight: 500 };
          } else {
            return { color: 'black', fontSize: '1.1em', fontWeight: 300 };
          }
    };

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
            <h2 className='title'>Ladder</h2>
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
                    <TableHead>
                        <TableRow
                            sx={{
                                display: 'table',
                                width: '100%',
                                tableLayout: 'fixed',
                            }}
                            ref={firstRowRef}
                        >
                            <TableCell
                                sx={{ 
                                    borderBottom: '2px solid #F8A38B', 
                                    color: 'goldenrod',
                                    fontSize: '1.8em',
                                    fontWeight: '900',
                                }}
                            >
                                {rows[0].rank}
                            </TableCell>
                            <TableCell 
                                align="right" 
                                sx={{ 
                                    borderBottom: '2px solid #F8A38B' 
                                }}
                            >
                                {rows[0].pseudo}
                            </TableCell>
                            <TableCell 
                                align="right" 
                                sx={{ 
                                    borderBottom: '2px solid #F8A38B' 
                                }}
                            >
                                {rows[0].wins} wins
                            </TableCell>
                            <TableCell 
                                align="right" 
                                sx={{ 
                                    borderBottom: '2px solid #F8A38B' 
                                }}
                            >
                                {rows[0].losses} losses
                            </TableCell>
                            <TableCell 
                                align="right" 
                                sx={{ 
                                    borderBottom: '2px solid #F8A38B' 
                                }}
                            >
                                {rows[0].status}
                            </TableCell>
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
                            {rows.slice(1).map((row, index) => (
                                <TableRow
                                    key={row.pseudo}
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        display: 'table',
                                        width: '100%',
                                        tableLayout: 'fixed',
                                    }}
                                >
                                    <TableCell 
                                        sx={{ 
                                            borderBottom: '2px solid #F8A38B',
                                            color: rankNumberStyles(index).color,
                                            fontSize: rankNumberStyles(index).fontSize,
                                            fontWeight: rankNumberStyles(index).fontWeight
                                        }}
                                    >
                                        {row.rank}
                                    </TableCell>
                                    <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{row.pseudo}</TableCell>
                                    <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{row.wins} wins</TableCell>
                                    <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{row.losses} losses</TableCell>
                                    <TableCell align="right" sx={{ borderBottom: '2px solid #F8A38B' }}>{row.status}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
};

export default Ladder;


// TODO: 
//  - Title to Table
//  - Style text
//  - Status component