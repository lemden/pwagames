import * as React from "react";
import "./countdown.styles.css";
import { IEvent, emit, subscribe } from "../../common/events";

export interface ICountdownProps {
    initialValue: number;
    animation: {
        timeout: number;
    };
}

export interface ICountdownState {
    currentValue: number;
}

export interface ITimeOverEvent extends IEvent<{}> {
}

export
interface IAdditionalTimeProps {
    time: number;
}
export interface IAdditionalTime extends IEvent<IAdditionalTimeProps>{
}

export
const AdditionalTime: IAdditionalTime = { name: "ADDITIONAL_TIME"}
export
const TimeOverEvent: ITimeOverEvent = { name: "TIME_OVER_EVENT" };

export default
class Countdown extends React.Component<ICountdownProps, ICountdownState> {
  
    private timeoutRef: any;
    private subscriptions: Array<() => void> = [];

    constructor(props: ICountdownProps) {
        super(props);
        this.state = {
            currentValue: props.initialValue,
        };
        this.subscriptions.push(subscribe(AdditionalTime, (eventProps: IAdditionalTimeProps) => {
            this.onAdditionalTime(eventProps.time);
        }));
    }

    private onAdditionalTime(time: number){
        if (this.timeoutRef) {
            clearTimeout(this.timeoutRef);
        }
        const newState = {
            currentValue: this.state.currentValue + time,
        };
        this.setState(newState, () => this.updateState());
    }

    public componentWillUnmount(){
        this.subscriptions.forEach(c => c());
        if (this.timeoutRef) {
            clearTimeout(this.timeoutRef);
        }
    }

    public componentDidMount() {
        this.updateState();
    }

    private updateState() {
        if (this.state.currentValue === 0) {
            emit(TimeOverEvent);
            return;
        }
        if (this.timeoutRef) {
            clearTimeout(this.timeoutRef);
        }
        this.timeoutRef = setTimeout(
            () => {
                this.setState({
                    currentValue: this.state.currentValue - 1,
                }, () => this.updateState());
            }, this.props.animation.timeout
        )
    }

    public render() {
        return (
            <div className={"countdown"}>
                <div className={"countdown_info"}>
                    <span>{this.state.currentValue}</span>
                    <div className={"left-border"}></div>
                    <div className={"right-border"}></div>
                </div>
            </div>
        );
    }
}