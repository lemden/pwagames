import * as React from "react";
import { ICardNumberStyle } from "../cardGenerators/common";

interface INumberCardProps {
    cardStyle: ICardNumberStyle;
    removed: boolean;
    selected: boolean;
    onCardClick(): void;
}

const getCardClassName = (selected: boolean, removed: boolean) => {
    const result: string[] = ["card"];
    if (removed) {
        result.push("removed");
    }
    if (selected) {
        result.push("selected");
    }
    return result.join(" ");
};

const NumberCard: React.StatelessComponent<INumberCardProps> = (props: INumberCardProps) => {
    const selectedStyle: React.CSSProperties = {
        backgroundColor: `rgb(${props.cardStyle.color.red},${props.cardStyle.color.green},${props.cardStyle.color.blue})`
    };
    return (
        <div className={getCardClassName(props.selected, props.removed)}
                onClick={props.onCardClick}>
            <div className="card-inner">
                <div className="card-front">
                    <span className={"text"}>?</span>
                </div>
                <div className={"card-back"}
                    style={selectedStyle}>
                    <span className={"text"}>{props.cardStyle.text}</span>
                </div>
            </div>
        </div>
        // <div className={getCardClassName(props.removed)}
        //         onClick={props.onCardClick}
        //         style={props.selected ? selectedStyle : {}}>
        //     {props.selected 
        //         && }
        //     {!props.selected 
        //         &&}
        // </div>
    );
};

export default NumberCard;
