import BaseFormatRule from "./format_rules/baseformatrule";
import CodyUSF4FormatRule from "./format_rules/codyusf4formatrule";
import DefaultFormatRule from "./format_rules/defaultformatrule";
import MenatSF5FormatRule from "./format_rules/menatsf5formatrule";
import YoungZekuSF5FormatRule from "./format_rules/youngzekusf5formatrule";

export default class MoveFormatter {
    rules: BaseFormatRule[];

    constructor() {
        this.rules = [
            new MenatSF5FormatRule(),
            new YoungZekuSF5FormatRule(),
            new CodyUSF4FormatRule(),
            new DefaultFormatRule()
        ];
    }

    formatToShorthand(moveData): string {
        let shorthand: string;

        for (const rule of this.rules) {
            if (this.skipFormattingMove(moveData)) {
                return "";
            }

            shorthand = rule.formatMove(moveData);

            if (shorthand) {
                return shorthand;
            }
        }

        return "";
    }

    private skipFormattingMove(moveData): boolean {
        const TARGET_COMBO: string[] = ["(TC)", "Target Combo"];
        const COMMAND_NORMAL: string[] = ["3", "6"];
        const SYMBOLIC_CMD_NORMAL: string[] = [">", "(air)", "(run)", "(lvl"];
        const RASHID_WIND: string = "(wind)";
        const MOVE_NAME: string = moveData.moveName;
        
        if (!moveData.numCmd) {
          if (!moveData.plnCmd) {
            return true;
          }
        }
    
        if (TARGET_COMBO.some(indicator => MOVE_NAME.includes(indicator))) {
          return true;
        }
    
        // Other languages have a cleaner way of representing this: if any of the values in the
        // designated array is in the numCmd, just return the move name since it's a command normal
        if (COMMAND_NORMAL.some(indicator => moveData.numCmd.includes(indicator))) {
          return true;
        }
    
        // If the above check doesn't find anything, check for some other common indicators; if
        // nothing comes back here, we're good and don't need to skip formatting
        if (SYMBOLIC_CMD_NORMAL.some(indicator => moveData.plnCmd.includes(indicator))) {
          return true;
        }
    
        // Rashid should be the only one (for now) to trigger this condition for his mixers
        if (MOVE_NAME.includes(RASHID_WIND)) {
          return true;
        }
    
        return false;       
    }
}