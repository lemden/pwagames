
export interface IPlayer<MoveResult, MoveResultAppliedResult, CurrentPlayerState> {
    name: string;
    applyMoveResult(result: MoveResult): Promise<MoveResultAppliedResult>;
    getMyState(): CurrentPlayerState;
}

export interface IPlayable<MoveDescription, MoveResult> {
    doNextMove(moveDescription: MoveDescription): Promise<MoveResult>;
}