import axios from "axios";
import React, {useCallback, useEffect, useState} from "react";
import ExpansionCard from "../Components/ExpansionCard";
import {Expansion} from "../Types/Expansion";
import {API_URL} from "../config";
import { useHistory } from "react-router-dom";

axios.defaults.withCredentials = true;

export const CreateGamePage: React.FC = () => {

    const [expansions, setExpansions] = useState<Expansion[]>([])
    const [selectedExpansions, setSelectedExpansions] = useState<Expansion[]>([]);
    const [userName, setUserName] = useState('');
    const history = useHistory()

    useEffect(() => {
        (async () => {
            // @ts-ignore
            const {data} = await axios.get(`${API_URL}/api/expansions`);
            setExpansions(data.data)
            setSelectedExpansions(data.data)
            await axios.get(`${API_URL}/sanctum/csrf-cookie`);
            console.log(axios.defaults);
        })();
    }, []);

    const submitToApi = async (event: any) => {
        event.preventDefault();


        await axios.post(`${API_URL}/api/game/store`, {
            name: userName,
            expansionIds: selectedExpansions.map(e => e.id)
        })

        history.push('/game');
    }

    const onToggle = useCallback((id: number, checked: boolean) => {
        if (checked) {
            const exp = expansions.find(e => e.id === id);
            if (exp) selectedExpansions.push(exp);
            setSelectedExpansions(selectedExpansions);
        } else {
            setSelectedExpansions(selectedExpansions.filter((e) => {
                return e.id !== id
            }));
        }

    }, [selectedExpansions, expansions]);

    return (<div className='w-full flex justify-center'>
        <div className='w-1/3 h-1/3 border flex'>

            <form onSubmit={submitToApi}>
                <div>
                    {expansions.map((expansion) => {
                        return <ExpansionCard key={`expansion-${expansion.id}`} id={expansion.id} name={expansion.name}
                                              data-testid={`expansion-${expansion.id}`} onToggle={onToggle}/>
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