import React, {useState} from 'react';
import {Expansion} from "../Types/Expansion";

const ExpansionCard: React.FC<Expansion> = ({id, name}) => {
    const [isChecked, setIsChecked] = useState(true)

    return <div className='rounded border my-2 px-2 hover:bg-blue-300 cursor-pointer'>
        <input type="checkbox" className={'mr-3'} data-testid={`expansion-${id}-checkbox`} checked={isChecked} onChange={() => setIsChecked(!isChecked)}/>
        {name}
    </div>
}

export default ExpansionCard