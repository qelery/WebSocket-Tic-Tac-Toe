
interface SquareProps {
    marker: string;
    isDisabled: boolean;
    color: string;
    x: number;
    y: number;
}

const Square = ({ marker, isDisabled, color, x, y }: SquareProps) => {

    const disabledClass =  isDisabled ? 'disabled ' : '';
    const colorClass = color === 'red' ? 'red-marker' : 'blue-marker';
    const rightBorderClass = x < 2 ? 'right-border' : '';
    const bottomBorderClass = y < 2 ? 'bottom-border' : '';

    return (
        <div className={`square ${disabledClass} ${colorClass} ${rightBorderClass} ${bottomBorderClass}`}>
            <span>{ marker }</span>
        </div>
    )
}

export default Square;
