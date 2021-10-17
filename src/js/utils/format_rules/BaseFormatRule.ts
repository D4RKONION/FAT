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

    /**
     * Given a move in its full-length form (i.e., Stand HP), returns the
     * move in the common shorthand form of "abbreviated stance.abbreviated input",
     * (i.e., st.HP)
     * @param move The text representing the move as a string
     * @returns A string containing the abbreviated move
     */
    formatMove(move: string): string {
        let moveName: string = ""; 

        // If the move doesn't match the rule, we should break out of the method
        // so the next rule can take over
        if (!move.toLowerCase().includes(this.characterMoveRule.toLowerCase())) {
            return moveName;
        }

        // If the move contains something like (Hold), use the regex format method
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

    /**
     * This method abstracts getting the stance part of the move
     * and retrieving its abbreviation from the abbreviation map
     * @param move The move provided to the call to formatMove
     * @returns The stance of the move in its abbreviated form
     */
    private getStanceToAbbreviation(move: string): string {
        let stance = move.toLowerCase().split(' ')[0];
        return this.stanceToAbbreviationMap.get(stance);
    }

    /**
     * Given a move in its full-length form but with a trailing word
     * surrounded by parenthesis (i.e., Stand HP (Hold)), returns the
     * move in the common shorthand form of "abbr stance.abbr input (parenContent)"
     * i.e., st.HP (Hold)
     * @param move The move provided to the call to formatMove
     * @returns A string containing the abbreviated move
     */
    private formatMoveWithParenthesis(move: string) {
        let splitMoveFromExtraParens: string[] = move.split(/\s(\([a-z\s]*\))/i).filter((x: string) => x !== "");
        let splitMove: string[] = splitMoveFromExtraParens[0].split(' ');
        let modifierParens: string[] = splitMoveFromExtraParens.slice(1);
        let stanceAbbreviation: string = this.stanceToAbbreviationMap.get(splitMove[0].toLowerCase());
        let input: string = splitMove[splitMove.length - 1].toUpperCase();

        return `${stanceAbbreviation}${input} ${modifierParens.join(' ')}`;
    }

    /**
     * Given a move, extract the input from it. This method's logic will vary
     * for some characters, but the default case simply retrieves the currently
     * used input from the end of the string.
     * @param move The move provided to the call to formatMove
     */
    protected abstract extractInput(move: string): string[];
}