import * as React from "react";
import NumberCard from "./styledCards/numberCard";
import "./Card.styles.css";
import { ICardState, ICardClickParameters, CardClickEvent, ICardClickEvent } from "./MatchingCards";
import { emit } from "../../common/events";

interface ICardProps {
    cardState: ICardState;
    removed: boolean;
}

const Card: React.FC<ICardProps> = (props: ICardProps): JSX.Element => {
    const onCardClick = () => {
        emit<ICardClickParameters, ICardClickEvent>(CardClickEvent, {
            cardState: props.cardState,
        });
    };
    switch (props.cardState.card.cardType) {
        case "numbers":
            return (
                <NumberCard
                    removed={props.removed}
                    onCardClick={onCardClick}
                    cardStyle={props.cardState.card.cardStyle}
                    selected={props.cardState.selected}
                />
            );
        default:
            throw new Error("Unexpected card type");
    }
};

export default Card;
