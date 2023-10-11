import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

import Difficulty from './Difficulty/Difficulty';

import './Achievement.css';

interface Props {
    name: string,
    description: string,
    difficulty: number,
    isHidden: boolean,
    achievementInfo: {
        name: string,
        description: string,
        difficulty: number,
        isHidden: boolean,
    }
}

const Achievement: React.FC<Props> = ({ achievementInfo }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Card 
            id="achievement" 
            sx={{ width: 200, height: 80 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <CardContent id="cardContent" >
                <Box display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    padding="0px 10px"
                    width="200px"
                    height="90px"
                    overflow="scroll"
                >
                    {isHovering ? (
                        <div style={{ fontFamily: 'Roboto', fontWeight: 'none', textAlign: 'left', padding: '10px', textShadow: 'none', fontSize: '0.7em' }}>
                            <p>Some description hfuezf f jgrhikgb zbf ejbgjrkg nrzbn rhbnr  nkj bguef nksj nvfkn ezfhne e fenf hnfeohf ohouehgfou hgohgf uefouejfoezhj oejfoejf oezf</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ padding: '5px', }}>
                                {achievementInfo.name}
                            </div>
                            <div style={{ padding: '5px', }}>
                                <Difficulty difficultyLevel={achievementInfo.difficulty} />
                            </div>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default Achievement;