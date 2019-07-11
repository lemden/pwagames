import * as React from "react";
import "./additionalTimeIndicator.styles.css"
import { useGameEvent } from "../hooks/gameEvents";
import { AdditionalTime, IAdditionalTimeProps } from ".";
import { emit } from "../../common/events";

const AdditionalTimeIndicator: React.FC<{}> = () => {
    const additionalTime = useGameEvent<IAdditionalTimeProps>(AdditionalTime);
    const divRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const onAnimationComplete = () => {
            emit(AdditionalTime, { time: 0 });
        };
        if (divRef.current) {
            divRef.current.addEventListener(
                "animationend", 
                onAnimationComplete
            );
        }
        return () => {
            if (divRef.current) {
                divRef.current.removeEventListener(
                    "animationend", 
                    onAnimationComplete
                );
            }
        };
    }, []);
    const style = {
        display: additionalTime === undefined 
                    || additionalTime.time === 0 
                    ? "none" 
                    : "inline-block",
    };
    return (
        <>
            <div ref={divRef} style={style}
                className={`additional-time-indicator open`}>
                {additionalTime !== undefined && `+ ${additionalTime.time}`}
            </div>
        </>
    );
};

export default AdditionalTimeIndicator;
