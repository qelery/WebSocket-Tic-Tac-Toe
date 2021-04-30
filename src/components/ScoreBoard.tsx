import Score from './Score';

const ScoreBoard = () => {

    return (
        <div className="stats opaque">
            <Score name="Player X" />
            <Score name="Tie" />
            <Score name="Player O" />
        </div>
    )
}

export default ScoreBoard;