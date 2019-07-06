import * as React from "react";
import MatchingCardsGame, { MatchingCardPlayer, IMatchingGamePlayer } from "./MatchingCardsGame";
import CardBoardPresentation from "./CardField";
import { GameLevel } from "./cardGenerators/common";
import { IEvent, subscribe } from "../../common/events";
import dialog from "../dialog/dialog";
import { NoMoreCardsEvent } from "./MatchingCards";

export interface IMCControllerState {
    level: GameLevel;
    totalScore: number;
    gameNumber: number;
}

export interface IMCNextLevelParams {
    winner: IMatchingGamePlayer;
}
export interface IMCNextLevelEvent extends IEvent<IMCNextLevelParams>{}
export const MCNextLevelEvent: IMCNextLevelEvent = {name: "MCNextLevelEvent"};

export default
class MatchingCardsSinglePlayerGameController extends React.Component<{}, IMCControllerState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            level: 1,
            totalScore: 0,
            gameNumber: 0,
        };
        subscribe(MCNextLevelEvent, (params: IMCNextLevelParams) => {
            this.onNextLevel(params.winner);
        });
    }
    
    private onNextLevel(winner: IMatchingGamePlayer) {
        const level = this.state.level + 1 as GameLevel;
        if (level <= 10) {
            dialog.showAsDialog<void>((onOkClick) => {
                return (<div>
                    <h1>You did this!</h1>
                    <button className={"game-button"} onClick={() => onOkClick()}>
                        Next Level!
                    </button>
                </div>);
            })
            .then(() => {
                this.setState({ level, totalScore: winner.getMyState().points });
            });
        } else {
            dialog.showAsDialog<void>((onOkClick) => {
                return (<div>
                    <h1>Game Over!</h1>
                    <button className={"game-button"} onClick={() => onOkClick()}>
                        Start New Game!
                    </button>
                </div>);
            })
            .then(() => {
                this.setState({ level: 1, totalScore: 0, gameNumber: this.state.gameNumber + 1 });
            });
        }
    }

    public render() {
        return (
            <MatchingCardsGame
                key={`MatchingCardsGame_Level_${this.state.gameNumber}_${this.state.level}`}
                players={[
                    new MatchingCardPlayer("Player#1", 
                        this.state.totalScore),
                ]}
                level={this.state.level} 
                Presentation={CardBoardPresentation}
                cardType="numbers"
                settings={{
                    hideIfFailedTimeout: 1000,
                    hideIfSucceedTimeout: 500,
                    timeForRemoveCards: 250,
                }}
            />
        );
    }
}