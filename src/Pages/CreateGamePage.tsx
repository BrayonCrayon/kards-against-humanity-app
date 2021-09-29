import axios from "axios";
import React, {useEffect, useState} from "react";
import ExpansionCard from "../Components/ExpansionCard";
import {Expansion} from "../Types/Expansion";

export const CreateGamePage: React.FC = () => {

    const [expansions, setExpansions] = useState<Expansion[]>([])
    const [userName, setUserName] = useState('');

    useEffect(() => {
        (async () => {
            // @ts-ignore
            const {data} = await axios.get('http://localhost:8080/api/expansions');
            setExpansions(data.data)
        })();
    }, []);

    const submitToApi = (event: any) => {
        event.preventDefault();

        axios.post('http://localhost:8080/api/game/store', {
            name: userName,
            expansionIds: expansions.map(e => e.id)
        })
        // todo: make the game
    }

    return (<div className='w-full flex justify-center'>
        <div className='w-1/3 h-1/3 border flex'>

            <form onSubmit={submitToApi}>
                <div>
                    {expansions.map((expansion) => {
                        return <ExpansionCard key={`expansion-${expansion.id}`} id={expansion.id} name={expansion.name}
                                              data-testid={`expansion-${expansion.id}`}/>
                    })}
                </div>
                <label>
                    Name:
                    <input type='text' data-testid='user-name' name="name" className='border'
                           onChange={(event) => setUserName(event.target.value)}/>
                </label>
                <button data-testid='create-game-submit-button' className='bg-gray-300 p-2 text-gray-900 rounded shadow'>Enter game</button>
            </form>
        </div>
    </div>)
}