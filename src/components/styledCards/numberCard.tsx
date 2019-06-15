import * as React from "react";
import { ICardNumberStyle } from "../cardGenerators/common";

interface INumberCardProps {
    cardStyle: ICardNumberStyle;
    removed: boolean;
    selected: boolean;
    onCardClick(): void;
}


const NumberCard: React.StatelessComponent<INumberCardProps> = (props: INumberCardProps) => {
    const selectedStyle: React.CSSProperties = {
        backgroundColor: `rgb(${props.cardStyle.color.red},${props.cardStyle.color.green},${props.cardStyle.color.blue})`
    }
    return (
        <div className={`card ${props.removed ? "removed" : ""}` }
                onClick={props.onCardClick}
                style={props.selected ? selectedStyle : {}}>
            {props.selected 
                && <span className={"text"}>{props.cardStyle.text}</span>}
            {!props.selected 
                && <span className={"text"}>?</span>}
        </div>
    );
};

export default NumberCard;
