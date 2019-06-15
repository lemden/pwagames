interface ISubscriber<T> {
    event: IEvent<T>;
    callback(parameters: T): void;
}
const subscribers: ISubscriber<any>[] = [];

export 
interface IEvent<T> {
    readonly name: string;
}

export
function emit<T>(event: IEvent<T>, parameters?: T) {
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
function subscribe<T>(
        event: IEvent<T>, 
        callback: (parameters: T) => void): UnsubscribeMe {
    const subscriber: ISubscriber<T> = {
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
