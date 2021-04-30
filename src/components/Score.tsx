
interface ScoreProps {
    name: string;
}

const Score = ({ name }: ScoreProps) => {

    const score = 0;

    return (
        <div className="player">
            <p className="player__name">{ name }</p>
            <p className="player__score">0</p>
        </div>
    ) 
}

export default Score;