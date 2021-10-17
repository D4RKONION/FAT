import BaseFormatRule from "./format_rules/BaseFormatRule";
import MenatSF5FormatRule from "./format_rules/MenatSF5FormatRule";
import YoungZekuSF5FormatRule from "./format_rules/YoungZekuSF5FormatRule";

export default class MoveFormatter {
    rules: BaseFormatRule[];

    constructor() {
        this.rules = [
            new MenatSF5FormatRule(),
            new YoungZekuSF5FormatRule()
        ];
    }

    formatToShorthand(move: string): string {
        let shorthand: string = "";

        this.rules.forEach(rule => {
            shorthand = rule.formatMove(move);

            if (shorthand !== "") {
                return shorthand;
            }
        });

        return null;
    }
}