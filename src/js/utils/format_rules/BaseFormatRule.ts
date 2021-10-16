export default abstract class BaseFormatRule {
    characterMoveRule: string;
    strengths: string[] = ["lp", "mp", "hp", "lk", "mk", "hk"];
    stanceToAbbreviationMap: Map<string, string> = new Map([
        ["stand", "st."],
        ["crouch", "cr."],
        ["jump", "j."],
        ["neutral", "nj."],
        ["close", "c."],
        ["far", "f."],
        ["downback", "db."],
        ["back", "b."]
      ]);

    constructor(rule: string) {
        this.characterMoveRule = rule;
    }

    formatMove(move: string): string {
        let moveName: string = ""; 

        if (!move.includes(this.characterMoveRule)) {
            return moveName;
        }

        if (move.includes('(')) {
            return this.formatMoveWithParenthesis(move);
        }

        let stanceAbbreviation: string = this.getStanceToAbbreviation(move);
        let moveInput: string[] = this.extractInput(move);

        if (moveInput.length > 1) {
            moveName = `${stanceAbbreviation}${moveInput[0]} ${moveInput[1]}`;
        } else {
            moveName = `${stanceAbbreviation}${moveInput[0]}`;
        }

        return moveName;
    }

    private getStanceToAbbreviation(move: string): string {
        let stance = move.toLowerCase().split(' ')[0];
        return this.stanceToAbbreviationMap.get(stance);
    }

    private formatMoveWithParenthesis(move: string) {
        let splitMoveFromExtraParens: string[] = move.split(/\s(\([a-z\s]*\))/i).filter((x: string) => x !== "");
        let splitMove: string[] = splitMoveFromExtraParens[0].split(' ');
        let modifierParens: string[] = splitMoveFromExtraParens.slice(1);
        let stanceAbbreviation: string = this.stanceToAbbreviationMap.get(splitMove[0].toLowerCase());
        let input: string = splitMove[splitMove.length - 1].toUpperCase();

        return `${stanceAbbreviation}${input} ${modifierParens.join(' ')}`;
    }

    protected abstract extractInput(move: string): string[];
}