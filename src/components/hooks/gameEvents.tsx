import { useState, useEffect } from "react";
import { IEvent, subscribe } from "../../common/events";

export
function useGameEvent<P>(eventObject: IEvent<P>): P | undefined {
    const [parameters, setParameters] = useState<P>();
    useEffect(() => {
        return subscribe(eventObject, setParameters);
    }, []);
    return parameters;
}