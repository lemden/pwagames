import * as React from "react";
import "./scoreMenu.styles.css";
import { MatchingCardSettings } from "../../../settings";
import Counter from "../counter/counter";

export interface IScoredPlayer {
    score: number;
    name: string;
}

export interface IScoreMenuProps {
    players: IScoredPlayer[];
    activePlayerIndex: number;
    pointsMultiplier: number;
}

export default
class ScoreMenu extends React.Component<IScoreMenuProps> {


    public render() {
        const menuHeight: number = MatchingCardSettings.Layout.Menu.topMenuHeight;
        const singlePlayerContainerWidth = Math.round(100 / this.props.players.length);
        return (
            <div className={"scoreMenuContainer"}>
                <div className={`scoreMenu`} style={{
                        height: `${menuHeight}px`,
                    }}>
                    {this.props.players.map(
                        (player, index) => (
                            <div 
                                className={this.props.activePlayerIndex === index ? "active" : ""}
                                style={{
                                width: `${singlePlayerContainerWidth}%`
                            }}>
                                {this.props.players.length > 1 && <div>
                                    {player.name}
                                </div>}
                                <div>
                                    <Counter
                                        value={player.score}
                                        numberOfSymbols={4}
                                        animation={{
                                            initialChangeTimeout: 50,
                                            timeoutMultiplier: 1.1,
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    )}
                </div>
                <div className={`multiplier ${this.props.players.length === 1 ? "single" : ""}`}>x{this.props.pointsMultiplier}</div>
            </div>
        );
    }

}