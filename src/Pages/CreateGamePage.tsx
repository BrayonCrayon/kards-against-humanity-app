import axios from "axios";
import React, {useEffect, useState} from "react";
import ExpansionCard from "../Components/ExpansionCard";

export interface Expansion {
    id: number
    name: string
}

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

    const submitToapi = (event: any) => {
        event.prevent.default

    }

    return (<div className='w-full flex justify-center'>
        <div className='w-1/3 h-1/3 border flex'>

            <div>
                {expansions.map((expansion) => {
                    return <ExpansionCard key={`expansion-${expansion.id}`} id={expansion.id} name={expansion.name} data-testid={`expansion-${expansion.id}`}/>
                })}
            </div>
            <form action="" onSubmit={submitToapi}>
                <label>
                    Name:
                    <input type='text' className='border' onChange={(event) => setUserName(event.target.value)}/>
                </label>
                <label>
                    Expansion:
                    <input type='text' className='border'/>
                </label>
                <button className='bg-gray-500' onClick={() => console.log('submiting')}>Enter game</button>
            </form>
        </div>
    </div>)
}