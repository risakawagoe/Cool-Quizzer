import { COLOR_CORRECT, COLOR_INCORRECT } from "../models/ColorCode";

export function getGradingColor(score: number) {
    if(score >= 70) {
        return COLOR_CORRECT;
    }else if(score >= 55) {
        return 'yellow';
    }else if(score >= 40) {
        return 'orange';
    }else {
        return COLOR_INCORRECT;
    }
}