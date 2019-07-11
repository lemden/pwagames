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
            red: Math.round(Math.random() * 50 + 205),
            green: Math.round(Math.random() * 50 + 205),
            blue: Math.round(Math.random() * 50 + 205),
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
const getGameSettings = (level: GameLevel) => {
    return {
        1: {cards: 3, time: 15},
        2: {cards: 4, time: 15},
        3: {cards: 5, time: 30},
        4: {cards: 6, time: 40},
        5: {cards: 8, time: 50},
        6: {cards: 9, time: 50},
        7: {cards: 10, time: 60},
        8: {cards: 12, time: 70},
        9: {cards: 14, time: 80},
        10: {cards: 15, time: 90},
    }[level];
};

export
const getNumberCards = (level: GameLevel): ICardDefinition[] => {
    const temp: ICardDefinition[] = new Array(getGameSettings(level).cards)
                    .fill(null)
                    .map((value, index) => ({
                        cardStyle: getRandomNumberCardStyle(index + 1 + ""),
                        cardType: "numbers",
                    }));
    return temp.concat(temp)
                .sort(() => Math.random() - 0.5);
};
