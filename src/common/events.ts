interface ISubscriber<P, T extends IEvent<P>> {
    event: T;
    callback(parameters: P): void;
}
const subscribers: ISubscriber<any, any>[] = [];

export 
interface IEvent<P> {
    readonly name: string;
    verify?(parameter: P): boolean;
}

export
function emit<P, T extends IEvent<P>>(event: T, parameters?: P) {
    if (typeof(event.verify) === "function"
            && typeof(parameters) !== "undefined") {
        if (!event.verify(parameters)) {
            throw new Error("Invalid Parameter ["+ event.name +"]");
        }
    }
    let subscribersFound = 0;
    subscribers
        .forEach((s) => {
            if (s.event === event) {
                s.callback(parameters);
                subscribersFound ++;
            }
        });
    if (!subscribersFound) {
        console.log("No subscribers found");
    }
}

type UnsubscribeMe = () => void;

export
function subscribe<P, E extends IEvent<P>>(
        event: E, 
        callback: (parameters: P) => void): UnsubscribeMe {
    const subscriber: ISubscriber<P, E> = {
        event, callback
    };
    subscribers.push(subscriber);
    return () => {
        const index = subscribers.findIndex((s) => s === subscriber);
        if (index < 0) {
            throw new Error("Subscriber not found!");
        }
        subscribers.splice(index, 1);
    };
}
