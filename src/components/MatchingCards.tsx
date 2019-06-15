import * as React from "react";
import { emit, IEvent, subscribe } from "../common/events";
import { IPlayable } from "../common/game/interfaces";
import { CardType, GameLevel, getNumberCards, ICardDefinition } from "./cardGenerators/common";

export interface ICardClickParameters {
    cardState: ICardState;
}
export interface ICardsSelectedEvent {
    selectedCards: SelectedCards;
}
export interface ICardClickEvent<T> extends IEvent<T>{}

export const CardClickEvent: ICardClickEvent<ICardClickParameters> = {name: "CardClickEvent"};
export const CardSelectedEvent: ICardClickEvent<ICardsSelectedEvent> = {name: "CardSelectedEvent"};

export interface INoMoreCardsEvent extends IEvent<{}> {}
export const NoMoreCardsEvent: INoMoreCardsEvent = { name: "NoMoreCardsEvent" };

export
interface IMatchingCardsFieldProps {
    cardStates: ICardState[];
    removedCards: SelectedCards | null;
    length: number;
}

export
interface IMatchingCardsProps {
    level: GameLevel;
    cardType: CardType;
    settings: {
        hideTimeout?: number;
    },
    Presentation: React.FC<IMatchingCardsFieldProps>;
}
interface IMatchingCardBoardProps {
    locked?: boolean;
}

export
interface ICardState {
    index: number;
    card: ICardDefinition;
    selected: boolean;
}
export
interface IMatchingCardsState {
    cardStates: ICardState[];
    length: number;
    removedCards: SelectedCards | null;
}

export
class SelectedCards {
    private selectedCards: number[] = [];

    public setSelectedCard(selectedCard: number) {
        if (this.selectedCards.length !== 2) {
            if (!this.selectedCards.length || 
                    (this.selectedCards[0] !== selectedCard)) {
                this.selectedCards.push(selectedCard);
            }
        } else {
            throw new Error("Cannot selected more cards!");
        }
    }

    public canSelectMoreCards() {
        return this.selectedCards.length < 2;
    }

    public getFirstSelectedCard(){
        return this.selectedCards[0];
    }

    public getSecondSelectedCard(){
        return this.selectedCards[1];
    }
}

export
interface IEarnedPoints {
    readonly points: number;
}

export default
class MatchingCardsBoard 
    extends React.Component<IMatchingCardsProps & IMatchingCardBoardProps, IMatchingCardsState>
    implements IPlayable<SelectedCards, IEarnedPoints> {
    
    private cancelSubscriptions: Array<() => void> = [];
    private theStepSelectedCards = new SelectedCards();

    constructor(props: IMatchingCardsProps) {
        super(props);
        const cardStates = this.genInitialCardStates(
            props.cardType, 
            props.level
        );
        this.state = {
            cardStates,
            length: cardStates.length,
            removedCards: null,
        };
        this.cancelSubscriptions.push(
            subscribe(CardClickEvent, (parameters: ICardClickParameters) => {
                this.onCardClick(parameters);
            })
        );
    }

    private selectOrDeselectCard(index: number, selected: boolean) {
        const cardStates = this.state.cardStates.slice(0);
        const card = this.getCardByIndex(index);
        card.selected = selected;
        this.setState({ cardStates });
    }

    public doNextMove(moveDescription: SelectedCards): Promise<IEarnedPoints> {
        return this.checkSelectedCards(moveDescription);
    }

    private onCardClick(parameters: ICardClickParameters) {
        if (this.props.locked) {
            return;
        }
        const clickedIndex = parameters.cardState.index;
        if (this.theStepSelectedCards.canSelectMoreCards()) {
            this.selectOrDeselectCard(clickedIndex, true);
            this.theStepSelectedCards
                .setSelectedCard(clickedIndex);
            if (!this.theStepSelectedCards
                    .canSelectMoreCards()) {
                emit(CardSelectedEvent, 
                    { selectedCards:  this.theStepSelectedCards }
                );
                this.theStepSelectedCards = new SelectedCards();
            }
        }
    }
    
    private showRemovedCards(
            removedCards: SelectedCards,
            onComplete: () => void) {
        this.setState({ removedCards, });
        setTimeout(
            () => onComplete(), 1000
        );
    }

    private checkSelectedCards(selectedCards: SelectedCards): Promise<IEarnedPoints> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.areTwoCardsTheSame(selectedCards)) {
                    this.showRemovedCards(
                        selectedCards,
                        () => {
                            this.removeSelectedCards(
                                selectedCards,
                                () => resolve({ points: 1 })
                            );
                        }
                    );
                } else {
                    this.hideSelectedCards(selectedCards);
                    resolve({ points: 0 });
                }
            }, this.props.settings.hideTimeout || 1000);
        });
    }

    private getCardByIndex(index: number) {
        return this.state.cardStates.filter((v) => v.index === index)[0];
    }

    private hideSelectedCards(selectedCards: SelectedCards) {
        const cardStates = this.state.cardStates.slice(0);
        const card1 = this.getCardByIndex(selectedCards.getFirstSelectedCard());
        const card2 = this.getCardByIndex(selectedCards.getSecondSelectedCard());
        card1.selected = false;
        card2.selected = false;
        this.setState({ cardStates });
    }

    private removeSelectedCards(selectedCards: SelectedCards, onComplete: () => void) {
        const cardStates = this.state.cardStates
                        .filter((card) => {
                            return (card.index !== selectedCards.getFirstSelectedCard())
                                        && (card.index !== selectedCards.getSecondSelectedCard())
                        });
        this.setState({ cardStates, }, 
            () => {
                if (!cardStates.length) {
                    emit(NoMoreCardsEvent, {});
                }
                onComplete();
            }
        );
    }

    private areTwoCardsTheSame(selectedCards: SelectedCards): boolean {
        const cardState1 = this.getCardByIndex(selectedCards.getFirstSelectedCard());
        const cardState2 = this.getCardByIndex(selectedCards.getSecondSelectedCard());
        return cardState1.card.cardStyle === cardState2.card.cardStyle;
    }

    public componentWillUnmount() {
        this.cancelSubscriptions.forEach(c => c());
    }

    private genInitialCardStates(cardType: CardType, level: GameLevel): ICardState[] {
        return this.genCardDefs(cardType, level)
                    .map((card, index) => ({
                        card,
                        selected: false,
                        index,
                    }));
    }

    private genCardDefs(cardType: CardType, level: GameLevel): ICardDefinition[] {
        switch (cardType) {
            case "numbers":
                return getNumberCards(level);
            default:
                throw new Error("unexpected card type: " + cardType);
        }
    }

    public render() {
        return (
            <this.props.Presentation
                removedCards={this.state.removedCards}
                cardStates={this.state.cardStates}
                length={this.state.length}
            />
        );
    }

}
