import React, {useCallback, useEffect, useState} from "react";
import ExpansionCard from "../Components/ExpansionCard";
import {Expansion} from "../Types/Expansion";
import {useHistory} from "react-router-dom";
import {apiClient} from "../api/apiClient";


type ExpansionOption = {
    expansion: Expansion
    isSelected: boolean
}

export const CreateGamePage: React.FC = () => {

    const [expansions, setExpansions] = useState<ExpansionOption[]>([]);
    const [userName, setUserName] = useState('');
    const history = useHistory()

    useEffect(() => {
        (async () => {
            // @ts-ignore
            const {data} = await apiClient.get(`/api/expansions`);

            setExpansions(data.data.map((item: Expansion) => {
                return {
                    expansion: item,
                    isSelected: true
                }
            }))
        })();
    }, []);

    const submitToApi = async (event: any) => {
        event.preventDefault();

        await apiClient.post(`/api/game/store`, {
            name: userName,
            expansionIds: expansions.filter(e => {
                return e.isSelected;
            }).map(e => e.expansion.id)
        })

        history.push('/game');
    }

    const onToggle = useCallback((id: number, checked: boolean) => {
        setExpansions((prev) => {
            const expansionOption = prev.find(item => item.expansion.id === id);
            if (expansionOption) expansionOption.isSelected = checked;
            return prev;
        })

    }, []);

    return (<div className='w-full flex justify-center'>
        <div className='w-1/3 border flex'>

            <form onSubmit={submitToApi} className="flex flex-col p-2 shadow-lg rounded">
                <div className="text-2xl font-semibold mb-4">Create Game</div>
                <div className="h-64 overflow-x-auto p-2 border rounded mb-4">
                    {expansions.map(({expansion}) => {
                        return <ExpansionCard key={`expansion-${expansion.id}`} id={expansion.id} name={expansion.name}
                                              data-testid={`expansion-${expansion.id}`} onToggle={onToggle}/>
                    })}
                </div>
                <label className="mb-4">
                    Name:
                    <input type='text' data-testid='user-name' name="name" className='border-2 rounded shadow '
                           onChange={(event) => setUserName(event.target.value)}/>
                </label>
                <button data-testid='create-game-submit-button'
                        className='bg-gray-300 p-2 text-gray-900 rounded shadow'>Enter game
                </button>
            </form>
        </div>
    </div>)
}