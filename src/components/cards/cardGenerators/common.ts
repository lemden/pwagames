export
interface ICardNumberStyle {
    readonly color: {
        readonly red: number;
        readonly green: number;
        readonly blue: number;
    }
    text?: string;
}
export
type CardStyle = ICardNumberStyle;
export
type CardType = "numbers";

export
interface ICardDefinition {
    cardType: CardType;
    cardStyle: CardStyle;
}

export
type GameLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export
const getRandomNumberCardStyle = (text: string): ICardNumberStyle  => {
    return {
        color: {
            red: Math.round(Math.random() * 255),
            green: Math.round(Math.random() * 255),
            blue: Math.round(Math.random() * 255),
        },
        text
    }
}

export
const getColsAndRows = (numberOfCards: number) => {
    const buffer: number[] = [];
    let temp = Math.ceil(numberOfCards / 2);
    while (temp) {
        if (numberOfCards % temp === 0) {
            buffer.push(temp);
        }
        temp --;
    }
    let minDiff: number | null = null;
    let bestPair: [number, number] = [-1, -1];
    for (let i=0;i<buffer.length;i++) {
        const a = buffer[i];
        const b = numberOfCards / a;
        if (minDiff === null || Math.abs(a - b) < minDiff) {
            minDiff = Math.abs(a - b);
            bestPair = [a, b];
        }
    }
    return {rows: bestPair[0], cols: bestPair[1]};
}


export
const getNumberOfUniqueCards = (level: GameLevel) => {
    return (level + 2);
};

export
const getNumberCards = (level: GameLevel): ICardDefinition[] => {
    const temp: ICardDefinition[] = new Array(getNumberOfUniqueCards(level))
                    .fill(null)
                    .map((value, index) => ({
                        cardStyle: getRandomNumberCardStyle(index + 1 + ""),
                        cardType: "numbers",
                    }));
    return temp.concat(temp).sort(() => Math.random() - 0.5);
};
