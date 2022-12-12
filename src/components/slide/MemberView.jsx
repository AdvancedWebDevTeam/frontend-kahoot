import React from 'react'
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io("http://localhost:3001");

export default function MemberView() {

    const [index, setIndex] = useState(0);

    useEffect(() => {
        socket.on('response', (index) => setIndex(index));
    }, [])

    return (
        <div>
            <h1>{index}</h1>
        </div>
    )
}
