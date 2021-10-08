import React, {useCallback, useState} from 'react';
import {Expansion} from "../Types/Expansion";

interface ExpansionCardProps extends Pick<Expansion, 'id' | 'name'> {
    checked: boolean;
    onToggle: (id: number, checked: boolean) => void;
}

const ExpansionCard: React.FC<ExpansionCardProps> = ({id, name, checked, onToggle}) => {
    const [isChecked, setIsChecked] = useState(true);

    const onChange = useCallback(() => {
        onToggle(id, checked);
        setIsChecked((checked) => !checked)
    }, []);

    return (
        <div className={`rounded border my-2 px-2 hover:shadow cursor-pointer my-2${isChecked ? ' bg-blue-100' : ''}`}
             onClick={onChange}>
            {name}
        </div>
    );
}

export default ExpansionCard