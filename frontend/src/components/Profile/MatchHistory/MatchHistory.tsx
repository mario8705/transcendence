import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer,
    TableRow 
} from '@mui/material';

import './MatchHistory.css';

import AvatarOthers from '../../AvatarOthers/AvatarOthers';

const MatchHistory: React.FC<undefined> = () => {

    function mockData(
        scored: number,
        conceded: number,
        pseudo: string,
        avatar: string,
        date: string,
        status: string
    ) {
        return { scored, conceded, pseudo, avatar, date, status };
    }
    
    const rows = [
        mockData(3, 0, 'adversaire1', '', '09/11/01 9:34am', 'Online'),
        mockData(0, 3, 'adversaire2', '', '09/11/01 9:34am', 'Online'),
        mockData(3, 0, 'adversaire3', '', '09/11/01 9:34am', 'Offline'),
        mockData(0, 3, 'adversaire4', '', '09/11/01 9:34am', 'Offline'),
        mockData(3, 0, 'adversaire5', '', '09/11/01 9:34am', 'Playing'),
        mockData(3, 0, 'adversaire6', '', '09/11/01 9:34am', 'Add'),
    ];

    interface CellStyle {
        backgroundColor: string,
    }

    const outcome = (scored: number, conceded: number): CellStyle => {
        if (scored > conceded) {
            return { backgroundColor: '#85DE89', };
        } else {
            return { backgroundColor: '#DE8585', };
        }
    }

    return (
        <div className="matchHistory">
            <h2 className='title'>My Match History</h2>
            <TableContainer id="table-container-mh">
                <Table id="table-mh" aria-label="simple table">
                    <TableBody 
                        id="table-body-mh"
                    >
                        {rows.map((row) => (
                            <TableRow
                                key={row.pseudo}
                                sx={{ 
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    display: 'table',
                                    width: '100%',
                                    tableLayout: 'fixed',
                                    backgroundColor: outcome(row.scored, row.conceded).backgroundColor,
                                }}
                            >
                                <TableCell id="cell-scored-mh">
                                    {row.scored}
                                </TableCell>
                                <TableCell id="cell-dash-mh">
                                    -
                                </TableCell>
                                <TableCell id="cell-conceded-mh">
                                    {row.conceded}
                                </TableCell>
                                <TableCell id="cell-pseudo-mh">
                                    {row.pseudo}
                                </TableCell>
                                <TableCell id="cell-status-mh">
                                    <div className='cell-status-div-mh'>
                                        <AvatarOthers status={row.status} />
                                    </div>
                                </TableCell>
                                <TableCell id="cell-date-mh">
                                    <div className='cell-date-div-mh'>
                                        {row.date}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
};

export default MatchHistory;