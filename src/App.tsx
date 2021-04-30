import { useState } from 'react';
import Banner from "./components/Banner";
import Grid from "./components/Grid";
import ScoreBoard from "./components/ScoreBoard";

import RecordKeeper from "./model/RecordKeeper";

const App = () => {

    const [xRecords, setXRecords] = useState(new RecordKeeper());
    const [oRecords, setORecords] = useState(new RecordKeeper());
    const [activeMarker, setActiveMarker] = useState('X');
    const [totalPlacements, setTotalPlacements] = useState(0);


    return (
        <div className="wrapper">
            <Banner />
            <Grid />
            <ScoreBoard />
        </div>
    )
}

export default App;