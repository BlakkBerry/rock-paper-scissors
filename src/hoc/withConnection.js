import {HubConnectionBuilder} from "@microsoft/signalr";
import {useEffect, useState} from "react";

export const withConnection = (Component) => {

    return () => {

        const [connection, setConnection] = useState()

        useEffect(() => {
            const conn = new HubConnectionBuilder()
                .withUrl('https://localhost:5001/hubs/rps')
                .withAutomaticReconnect()
                .build();

            setConnection(conn)
        }, [])

        useEffect(() => {
            if (!connection) return

            connection.start()
                .then(result => {
                    console.log(`Connected from ${Component.name}!`);
                })
                .catch(e => console.log(`Connection failed in ${Component.name}: `, e));

            connection.on('ReceiveError', message => {
                console.log(`[ERROR in ${Component.name}]: `, message)
            })

            connection.onclose(e => {
                setConnection()
            })

        }, [connection])

        return <Component connection={connection}/>
    };
}
