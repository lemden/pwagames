import * as React from "react";
import { emit, subscribe } from "../../common/events";
import { DialogReadyEvent, ShowDialogEvent, IShowDialogEventProps, DialogCloseEvent } from "./dialog";
import "./dialog.styles.css";

export interface IDialogProps {
}

export interface IDialogState {
    currentRender: (() => JSX.Element) | null;
}

export default
class DialogView
        extends React.Component<IDialogProps, IDialogState> {

    constructor(props: IDialogProps) {
        super(props);
        this.state = {
            currentRender: null,
        };
        subscribe(ShowDialogEvent, (dialogProps: IShowDialogEventProps) => {
            this.onShow(dialogProps);
        });
        subscribe(DialogCloseEvent, () => {
            this.setState({currentRender: null});
        });
        this.hide = this.hide.bind(this);
    }
    
    private onShow(dialogProps: IShowDialogEventProps){
        this.setState({
            currentRender: dialogProps.render,
        });
    }
    
    public componentDidMount(){
        emit(DialogReadyEvent);
    }

    private hide(){
        emit(DialogCloseEvent);
        this.setState({currentRender: null});
    }

    public render() {
        if (!this.state.currentRender) {
            return null;
        }
        return (
            <> 
                <div className={"modal-background"}></div>
                <dialog className={"game-dialog"}>
                    {this.state.currentRender()}
                </dialog>
            </>
        );
    }
}