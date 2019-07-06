import * as React from "react";

export interface INumberPresentation {
    value: number;
    inProgress: boolean;
}

export default
class NumberPresentation extends React.Component<INumberPresentation> {
    private getInProgressValue(){
        if (this.props.value > 0 && this.props.value < 9) {
            return this.props.value - 1;
        } else if (this.props.value === 9) {
            return 0;
        }
        return 9;
    }
    
    public render(){
        return (
            <div className={"number-presentation"}>
                <div className={`top ${this.props.inProgress ? "animated": ""}`}>
                    <div className={"number"}>
                        <div className={"value"}>
                            <div className={"text-container"}>
                                <div className={"text-number"}>{this.props.value}</div>
                            </div>
                        </div>
                    </div>       
                </div>    
                <div className={`bottom ${this.props.inProgress ? "animated": ""}`}>
                    <div className={"number"}>
                        <div className={"value"}>
                            <div className={"text-container"}>
                                <div className={"text-number"}>
                                    {this.props.inProgress
                                        ? this.getInProgressValue()
                                        : this.props.value}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        )
    }
}