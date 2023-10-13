import './Difficulty.css';

interface Props {
    difficultyLevel: number;
  }

const Difficulty: React.FC<Props> = ({ difficultyLevel }) => {

    const colorLevelFn = () => {
        if (difficultyLevel === 1) {
            return { colorLevel1 : "green", colorLevel2: "rgba(0, 0, 0, 0)", colorLevel3: "rgba(0, 0, 0, 0)" };
        } else if (difficultyLevel === 2) {
            return { colorLevel1 : "orange", colorLevel2: "orange", colorLevel3: "rgba(0, 0, 0, 0)" };
        } else {
            return { colorLevel1 : "red", colorLevel2: "red", colorLevel3: "red" };
        }
    }

    const { colorLevel1, colorLevel2, colorLevel3 } = colorLevelFn();

    return (
        <div id="container">
            <div className="bar" style={{ backgroundColor: colorLevel1 }}></div>
            <div className="bar" style={{ backgroundColor: colorLevel2 }}></div>
            <div className="bar" style={{ backgroundColor: colorLevel3 }}></div>
        </div>
    );
};

export default Difficulty;