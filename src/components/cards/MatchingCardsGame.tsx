import * as React from "react";
import MatchingCardsBoard, { IMatchingCardsProps, CardSelectedEvent, ICardsSelectedEvent, IEarnedPoints, NoMoreCardsEvent, INoMoreCardsEvent } from "./MatchingCards";
import { subscribe, IEvent } from "../../common/events";
import { IPlayer } from "../../common/game/interfaces";
import ScoreMenu from "../menu/scoreMenu";

export
type IMatchingGamePlayer = IPlayer<IEarnedPoints, IEarnedPoints, IEarnedPoints>;

export interface IMatchingCardsGameOver extends IEvent<IMatchingGamePlayer>{}

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
    private earnedPoints: IEarnedPoints = { points: 0 };

    constructor(public readonly name: string){
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
                (event: ICardsSelectedEvent) => {
                    this.onMoveComplete(event); 
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
        console.log(winner);
    }

    public componentWillUnmount(){
        this.cancelSubscriptions.forEach(c => c());
    }

    public getActivePlayer(){
        return this.props.players[this.state.currentPlayerIndex];
    }

    private onMoveComplete(
        event: ICardsSelectedEvent) {
        this.setState(
            { lockedWhileStepInProgress: true },
            () => {
                this.performMove(event)
                    .then((moveResults) => {
                        this.setState(
                            { lockedWhileStepInProgress: false, lastEarnedPoints: moveResults.justEarnedPoints },
                            () => this.nextPlayer(moveResults.justEarnedPoints)
                        )
                    });
            }
        );
    }

    private performMove(event: ICardsSelectedEvent): Promise<{
                                                        playerTotalEarnedPoint: IEarnedPoints, 
                                                        justEarnedPoints: IEarnedPoints,
                                                    }> {
        if (this.matchingCardsBoardRef.current) {
            return this.matchingCardsBoardRef
                    .current
                    .doNextMove(event.selectedCards)
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