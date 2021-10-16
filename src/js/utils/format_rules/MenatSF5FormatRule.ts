import BaseFormatRule from "./BaseFormatRule";

export default class MenatSF5FormatRule extends BaseFormatRule { 
    private orbLabel = this.characterMoveRule.charAt(0).toUpperCase() + this.characterMoveRule.slice(1);
    
    constructor() {
        super("orb");
    }

    protected extractInput(move: string): string[] {
        let input: string[];
        let moveInput: string = move.split(' ').find(input => this.strengths.some(inputStr => inputStr === input));

        input.push(moveInput.toUpperCase());
        input.push(this.orbLabel);

        return input;
    }
}