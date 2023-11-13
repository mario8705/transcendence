import Achievement from './Achievement/Achievement';

import './Achievements.css';

const Achievements: React.FC = () => {

    function mockData(
        name: string,
        description: string,
        difficulty: number,
        isHidden: boolean,
    ) {
        return { name, description, difficulty, isHidden };
    }
    
    const rows = [
        mockData('name1', '10 wins in a row', 1, false),
        mockData('name22', '20 wins in a row', 2, false),
        mockData('name333', '100 wins in a row', 3, false),
        mockData('name4444', 'Won against 3 different players', 1, false),
        mockData('name55555', 'Abandonned when the score was 0-0', 1, true),
    ];

    return (
        <div className="achievements">
            <h2 className='title-a'>Achievements</h2>
            {rows.map((achievementInfo) => (
                <Achievement {...achievementInfo} />
            ))}
        </div>
    );
};

export default Achievements;