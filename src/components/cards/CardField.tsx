import * as React from "react";
import "./CardField.styles.css";
import { IMatchingCardsFieldProps, ICardState } from "./MatchingCards";
import Card from "./Card";
import { useWindowResize } from "../hooks/windowEvents";
import { getColsAndRows } from "./cardGenerators/common";
import { MatchingCardSettings } from "../../settings";

const MIN_SCREEN_SIZE = MatchingCardSettings.Layout.minWidthForFullScreen;

const getFieldContainerSize = (windowWidth: number, windowHeight: number): {containerWidth: number, containerHeight: number} =>  {
    const minSize = Math.min(windowWidth, windowHeight);
    if (minSize <= MIN_SCREEN_SIZE) {
        return {containerWidth: windowWidth , containerHeight: windowHeight};
    }
    return {containerWidth: minSize, containerHeight: minSize};
}

const getFieldContainerSizeWithMenu = (windowWidth: number, windowHeight: number): {containerWidth: number, containerHeight: number} =>  {
    const containerSize = getFieldContainerSize(
        windowWidth, windowHeight
    );
    return {
        containerWidth: containerSize.containerWidth - MatchingCardSettings.Layout.Menu.sideMenuWidth,
        containerHeight: containerSize.containerHeight - MatchingCardSettings.Layout.Menu.topMenuHeight,
    }
}

const getRowAndColNumber = (index: number, numberOfColumns: number) => {
    const rowNumber = Math.floor(index / numberOfColumns);
    const colNumber = index % numberOfColumns;
    return {rowNumber, colNumber};
}

const CardBoardPresentation: React.FC<IMatchingCardsFieldProps> = (props: IMatchingCardsFieldProps ) => {
    const { windowWidth, windowHeight } = useWindowResize();
    const isPortrait = windowWidth < windowHeight;

    const {containerWidth, containerHeight} = getFieldContainerSizeWithMenu(windowWidth, windowHeight);
    const {rows: estimatedRows, cols: estimatedCols} = getColsAndRows(props.length);

    const rows = isPortrait
                    ? estimatedRows
                    : estimatedCols;
    const cols = isPortrait
                    ? estimatedCols
                    : estimatedRows;

    const singleCardWidth = Math.round(containerWidth / cols);
    const singleCardHeight = Math.round(containerHeight / rows);

    const cards: JSX.Element[] = props.cardStates
                .map((cardState: ICardState, index: number) => {
                    const { rowNumber, colNumber } = getRowAndColNumber(cardState.index, cols);
                    const cardContainerStyles: React.CSSProperties = {
                        width: `${singleCardWidth}px`,
                        height: `${singleCardHeight}px`,
                        top: `${rowNumber * singleCardHeight}px`, 
                        left: `${colNumber * singleCardWidth}px`,
                    };
                    return (
                        <div className={"cardContainer"}
                            key={cardState.index}
                            style={cardContainerStyles} >
                            <Card 
                                removed={
                                    props.removedCards !== null
                                        &&
                                    (
                                        props.removedCards.getFirstSelectedCard() === cardState.index
                                            ||
                                        props.removedCards.getSecondSelectedCard() === cardState.index
                                    )
                                }
                                cardState={cardState} 
                            />
                        </div>
                    );
                });
    const style: React.CSSProperties = {
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        top: `calc(50% + ${Math.ceil(MatchingCardSettings.Layout.Menu.topMenuHeight / 2)}px)`,
        left: `calc(50% + ${Math.ceil(MatchingCardSettings.Layout.Menu.sideMenuWidth / 2)}px)`,
    };
    return (
        <div style={style} className={"cardField"}>
            {cards}
        </div>
    );
};

export default CardBoardPresentation;
