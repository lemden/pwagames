import * as React from "react";
import "./counter.styles.css";
import SingleNumberCounter from "./helpers/singleNumberCounter";

export interface ICounterProps {
    value: number;
    numberOfSymbols: number;
    animation: {
        initialChangeTimeout: number;
        timeoutMultiplier: number;
    };
}

export default
class Counter extends React.Component<ICounterProps> {

    private getNumbers() {
        let value = this.props.value + "";
        if (value.length < this.props.numberOfSymbols) {
            value = new Array(
                this.props.numberOfSymbols - value.length 
            ).fill("0").join("") + value;
        }
        return value
                .substr(- this.props.numberOfSymbols)
                .split("")
                .map((v) => parseInt(v));
    }

    public render(){
        return (
            <div className={"counter"}>
                {this.getNumbers()
                    .map( (v,k) => (
                        <SingleNumberCounter
                            key={`v_${k}`}
                            value={v} 
                            animation={this.props.animation}
                        />
                    ))}
            </div>
        );
    }
}