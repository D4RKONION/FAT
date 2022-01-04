import BaseFormatRule from "./baseformatrule";

export default class DefaultFormatRule extends BaseFormatRule {
    constructor() {
        super("");
    }
    
    protected extractInput(moveData): string[] {
        let input: string[] = [];
        let splitMove = moveData.moveName.split(' ');

        input.push(splitMove[splitMove.length - 1].toUpperCase());

        return input;
    }

}