import Square from './Square';

const Grid = () => {

    return (
        <div className="grid opaque">
            <Square marker="O" isDisabled={true} color="blue" x={0} y={0} />
            <Square marker="O" isDisabled={true} color="blue" x={1} y={0} />
            <Square marker="X" isDisabled={true} color="red" x={2} y={0} />
            <Square marker="X" isDisabled={true} color="red" x={0} y={1} />
            <Square marker="O" isDisabled={true} color="blue" x={1} y={1} />
            <Square marker="X" isDisabled={true} color="red" x={2} y={1} />
            <Square marker="X" isDisabled={true} color="red" x={0} y={2} />
            <Square marker="O" isDisabled={true} color="blue" x={1} y={2} />
            <Square marker="O" isDisabled={true} color="blue" x={2} y={2} />
        </div>
    );
}

export default Grid;