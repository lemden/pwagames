import * as React from "react";
import { IEvent, emit } from "../../common/events";
import { ICardClickEvent } from "../cards/MatchingCards";

export interface IDialogReadyParameters {
    render(): JSX.Element;
}
export interface IDialogReadyEvent extends IEvent<IDialogReadyParameters> {}
export const DialogReadyEvent: IDialogReadyEvent = {name : "DialogReady"};

export interface IDialogCloseEvent extends IEvent<{}> {
}
export const DialogCloseEvent: IDialogCloseEvent = {name: "DialogClose"};

export interface IShowDialogEventProps {
    render(): JSX.Element;
}
export interface IShowDialogEvent extends IEvent<IShowDialogEventProps> {
}
export const ShowDialogEvent: IShowDialogEvent = {name: "ShowDialog"};

class Dialog {

    private closeCurrentDialog(){
        emit(DialogCloseEvent, {});
    }

    public showAsDialog<ExpectedResult>(render: (resolve: (r: ExpectedResult) => void, reject: (reason: string) => void) => JSX.Element): Promise<ExpectedResult> {
        return new Promise(
            (resolve, reject) => {
                const resolveAndClose = (r: ExpectedResult) => {
                    resolve(r);
                    this.closeCurrentDialog();
                };
                const rejectAndClose = (r: string) => {
                    reject(r);
                    this.closeCurrentDialog();
                };
                emit(
                    ShowDialogEvent, { 
                        render: () => {
                            return render(resolveAndClose, rejectAndClose);
                        }
                    }
                );
            }
        );
    }
}

export default new Dialog();
