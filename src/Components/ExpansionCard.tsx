import React, {ChangeEventHandler, useState} from 'react';
import {Expansion} from "../Types/Expansion";

interface ExpansionCardProps extends Pick<Expansion, 'id' | 'name'> {
    onToggle: (id: number, checked: boolean) => void
}

const ExpansionCard: React.FC<ExpansionCardProps> = ({id, name, onToggle}) => {
    const [isChecked, setIsChecked] = useState(true)

    const onChange = ({target: {checked}}: any) => {
        onToggle(id, checked)
        console.log('checked', checked)
        setIsChecked((checked) => !checked)
    }

    return <div className='rounded border my-2 px-2 hover:bg-blue-300 cursor-pointer'>
        <input type="checkbox" className={'mr-3'} data-testid={`expansion-${id}-checkbox`} checked={isChecked}
               onChange={onChange}/>
        {name}
    </div>
}

export default ExpansionCard