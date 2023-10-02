import { useRef, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow 
} from '@mui/material';

import AvatarOthers from '../../AvatarOthers/AvatarOthers';

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
        mockData(1, 'ycurbill', 15, 0, 'Online'),
        mockData(2, 'nul1', 9, 2, 'Add'),
        mockData(3, 'nul2', 9, 3, 'Playing'),
        mockData(4, 'nul3', 5, 1, 'Online'),
        mockData(5, 'nul4', 4, 5, 'Offline'),
        mockData(6, 'nul5', 4, 5, 'Add'),
    ];

    interface CellStyle {
        color: string,
        fontSize: string,
        fontWeight: number,
    }

    const rankNumberStyles = (index: number): CellStyle => {
        if (index === 0) {
            return { color: 'goldenrod', fontSize: '1.8em', fontWeight: 900 };
        } else if (index === 1) {
            return { color: 'silver', fontSize: '1.6em', fontWeight: 700 };
        } else if (index === 2) {
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
                currentFirstRow!.style.borderBottom = "5px solid #9747FF";
            } else {
                currentFirstRow!.style.borderBottom = "2px solid #9747FF";
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
            <TableContainer id="table-container-l">
                <Table id='table-l' aria-label="simple table">
                    <TableHead>
                        <TableRow id="head-row-l" ref={firstRowRef}>
                            <TableCell id="cell-head-rank-l"></TableCell>
                            <TableCell id="cell-head-pseudo-l"></TableCell>
                            <TableCell id="cell-head-wins-l">
                                Wins
                            </TableCell>
                            <TableCell id="cell-head-losses-l">
                                Losses
                            </TableCell>
                            <TableCell id="cell-head-avatar-l"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody id='table-body-l' ref={tableBodyRef}>
                        {rows.map((row, index) => (
                            <TableRow key={row.pseudo} id="row-body-l">
                                <TableCell 
                                    sx={{ 
                                        borderBottom: '1px solid #F8A38B',
                                        color: rankNumberStyles(index).color,
                                        fontSize: rankNumberStyles(index).fontSize,
                                        fontWeight: rankNumberStyles(index).fontWeight,
                                    }}
                                >
                                    {row.rank}
                                </TableCell>
                                <TableCell id="cell-pseudo-l">
                                    {row.pseudo}
                                </TableCell>
                                <TableCell id="cell-wins-l">
                                    {row.wins}
                                </TableCell>
                                <TableCell id="cell-losses-l">
                                    {row.losses}
                                </TableCell>
                                <TableCell id="cell-avatar-l">
                                    <AvatarOthers status={row.status}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
};

export default Ladder;