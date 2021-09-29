import React, {useState} from 'react';
import {Expansion} from "../Pages/CreateGamePage";

const ExpansionCard: React.FC<Expansion> = ({id, name}) => {
    const [isChecked, setIsChecked] = useState(true)

    return <div>
        <input type="checkbox" data-testid={`expansion-${id}-checkbox`} checked={isChecked} onChange={() => setIsChecked(!isChecked)}/>
        {name}
    </div>
}

export default ExpansionCard