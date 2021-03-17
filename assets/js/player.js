class Player {
    constructor(name, marker) {
        this.name = name || `Player ${marker}`;
        this.marker = marker;
        this.score = 0;
    }
}