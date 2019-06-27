import * as React from "react";
import MatchingCardsBoard, { IMatchingCardsProps, CardSelectedEvent, IEarnedPoints, NoMoreCardsEvent, INoMoreCardsEvent, ICardsSelectedParameters } from "./MatchingCards";
import { subscribe, IEvent, emit } from "../../common/events";
import { IPlayer } from "../../common/game/interfaces";
import ScoreMenu from "../menu/scoreMenu";
import dialog from "../dialog/dialog";
import { MCNextLevelEvent } from "./MatchingCardsSinglePlayerGameController";
import "../button/button.styles.css";

export
type IMatchingGamePlayer = IPlayer<IEarnedPoints, IEarnedPoints, IEarnedPoints>;

export interface IMatchingCardsGameOver extends IEvent<{}>{}

const MatchingCardsGameOver: IMatchingCardsGameOver = {name: ""}

export 
interface IMatchingCardsGameProps extends IMatchingCardsProps{
    players: IMatchingGamePlayer[];
}

export
interface IMatchingCardsGameState {
    lockedWhileStepInProgress: boolean;
    currentPlayerIndex: number;
    prevPlayerIndex: number;
    pointsMultiplier: number;
    lastEarnedPoints: IEarnedPoints | null;
}

export
class MatchingCardPlayer implements IPlayer<IEarnedPoints, IEarnedPoints, IEarnedPoints> {
    private earnedPoints: IEarnedPoints;

    constructor(public readonly name: string, initalPoints: number = 0){
        this.earnedPoints = { points: initalPoints };
    }
    
    public applyMoveResult(result: IEarnedPoints): Promise<IEarnedPoints> {
        this.earnedPoints = {
            points: this.earnedPoints.points + result.points,
        };
        return Promise.resolve( this.earnedPoints );
    }

    public getMyState(): IEarnedPoints {
        return this.earnedPoints;
    }
}

export default
class MatchingCardsGame extends React.Component<IMatchingCardsGameProps, IMatchingCardsGameState> {
    private matchingCardsBoardRef: React.RefObject<MatchingCardsBoard>;
    private cancelSubscriptions: Array<() => void> = [];

    constructor(props: IMatchingCardsGameProps) {
        super(props);
        this.matchingCardsBoardRef = React.createRef<MatchingCardsBoard>();
        this.state = {
            lockedWhileStepInProgress: false,
            currentPlayerIndex: 0,
            prevPlayerIndex: 0,
            pointsMultiplier: 1,
            lastEarnedPoints: null,
        };
        this.cancelSubscriptions.push(
            subscribe(
                CardSelectedEvent,
                (parameters: ICardsSelectedParameters) => {
                    this.onMoveComplete(parameters); 
                }
            )
        );
        this.cancelSubscriptions.push(
            subscribe(
                NoMoreCardsEvent,
                (event: {}) => this.onNoMoreCards()
            )
        );
    }

    private getLeader(): IMatchingGamePlayer {
        return this.props.players
                .sort((p1, p2) => (
                    p2.getMyState().points - p1.getMyState().points)
                )[0];
    }

    private onNoMoreCards(){
        const winner = this.getLeader();
        dialog.showAsDialog<void>((onOkClick) => {
                return (
                    <div>
                        <h1>You did this!</h1>
                        <main>+ {winner.getMyState().points}</main>
                        <div className={"dialog-buttons"}>
                            <button className={"game-button"} onClick={() => onOkClick()}>
                                Go to Next Level!
                            </button>
                        </div>
                    </div>
                );
            }
        )
        .then(() => {
            emit(MCNextLevelEvent, {
                winner
            });
        });
    }

    public componentWillUnmount(){
        this.cancelSubscriptions
            .forEach(c => c());
    }

    public getActivePlayer(){
        return this.props.players[this.state.currentPlayerIndex];
    }

    private onMoveComplete(
        parameters: ICardsSelectedParameters) {
        this.setState(
            { lockedWhileStepInProgress: true },
            () => {
                this.performMove(parameters)
                    .then((moveResults) => {
                        this.setState(
                            { lockedWhileStepInProgress: false, lastEarnedPoints: moveResults.justEarnedPoints },
                            () => this.nextPlayer(moveResults.justEarnedPoints)
                        )
                    });
            }
        );
    }

    private performMove(parameters: ICardsSelectedParameters): Promise<{
                                                        playerTotalEarnedPoint: IEarnedPoints, 
                                                        justEarnedPoints: IEarnedPoints,
                                                    }> {
        if (this.matchingCardsBoardRef.current) {
            return this.matchingCardsBoardRef
                    .current
                    .doNextMove(parameters.selectedCards)
                    .then(justEarnedPoints => {
                        return this.getActivePlayer()
                                .applyMoveResult({ points: justEarnedPoints.points * this.state.pointsMultiplier})
                                .then((playerTotalEarnedPoint) => ({
                                    playerTotalEarnedPoint,
                                    justEarnedPoints
                                }));
                    });
        }
        return Promise.reject();
    }

    private nextPlayer(earnedPoints: IEarnedPoints): void {
        let prevPlayerIndex = this.state.currentPlayerIndex;
        if (!earnedPoints.points) {
            let nextPlayerIndex = this.state.currentPlayerIndex + 1;
            if (nextPlayerIndex === this.props.players.length) {
                nextPlayerIndex = 0;
            }
            this.setState({
                currentPlayerIndex: nextPlayerIndex, 
                prevPlayerIndex,
                pointsMultiplier: 1, });
        } else {
            let pointsMultiplier = this.state.pointsMultiplier;
            if (this.state.currentPlayerIndex 
                === this.state.prevPlayerIndex) {
                pointsMultiplier ++;
            }
            this.setState({ prevPlayerIndex, pointsMultiplier, });
        }
    }
    
    public render(){
        return (
            <>
                <ScoreMenu
                    players={this.props
                            .players.map((player) => ({
                                name: player.name,
                                score: player.getMyState().points,
                            }))}
                    activePlayerIndex={this.state.currentPlayerIndex}
                    pointsMultiplier={this.state.pointsMultiplier}
                />
                <MatchingCardsBoard
                    ref={this.matchingCardsBoardRef}
                    locked={this.state.lockedWhileStepInProgress}
                    level={this.props.level} 
                    Presentation={this.props.Presentation}
                    cardType={this.props.cardType}
                    settings={this.props.settings}
                />
            </>
        );
    }
}