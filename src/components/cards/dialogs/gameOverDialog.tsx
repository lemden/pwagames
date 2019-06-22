import * as React from "react";
import Dialog from "../../dialog/dialogView";

export default
class GameOverDialog extends React.Component<{}> {


    public render() {
        return (
            <Dialog>
                {() => {
                    return (
                        <div>
                            Game Over!
                        </div>
                    );
                }}
            </Dialog>
        );
    }
}