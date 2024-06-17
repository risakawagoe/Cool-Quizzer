import { CheckIcon, Checkbox, CloseIcon, Radio } from "@mantine/core";

export const COLOR_CORRECT = "#94D82D";
export const COLOR_CORRECT_LIGHT = "#F4FCE3";
export const COLOR_INCORRECT = "#E03131";
export const COLOR_INCORRECT_LIGHT = "#FFF5F5";

export function getRadioIndicator(isCorrect: boolean, isSelected: boolean) {
    if(isSelected) {
        const correctIndicator = <Radio.Indicator variant="outline" radius="lg" icon={CheckIcon} color={COLOR_CORRECT} />;
        const incorrectIndicator = <Radio.Indicator variant="outline" radius="lg" icon={IncorrectIcon} color={COLOR_INCORRECT} />;
        return isCorrect ? correctIndicator : incorrectIndicator;
    }else {
        return <Radio.Indicator variant="outline" radius="lg"/>;
    }
}
export function getCheckboxIndicator(isCorrect: boolean, isSelected: boolean) {
    if(isSelected) {
        const correctIndicator = <Checkbox.Indicator variant="outline" radius="lg" icon={CheckIcon} color={COLOR_CORRECT} />;
        const incorrectIndicator = <Checkbox.Indicator variant="outline" radius="lg" icon={IncorrectIcon} color={COLOR_INCORRECT} />;
        return isCorrect ? correctIndicator : incorrectIndicator;
    }else {
        return <Checkbox.Indicator variant="outline" radius="lg"/>;
    }
}

export function getBorderColor(isCorrect: boolean, isSelected: boolean):string {
    if(isCorrect) {
        return COLOR_CORRECT;
    }else if(isSelected && !isCorrect) {
        return COLOR_INCORRECT;
    }else {
        return "";
    }
}
export function getBackgroundColor(isCorrect: boolean, isSelected: boolean):string {
    if(isCorrect) {
        return COLOR_CORRECT_LIGHT;
    }else if(isSelected && !isCorrect) {
        return COLOR_INCORRECT_LIGHT;
    }else {
        return "white";
    }
}

function IncorrectIcon() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', borderRadius: '50%' }}>
            <CloseIcon color="red" size="12" />
        </div>
    );
}