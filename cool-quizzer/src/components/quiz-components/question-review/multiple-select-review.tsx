import { Card, Checkbox, Group, RingProgress, Stack, Text, TypographyStylesProvider } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { MultipleSelectQuestion } from "../../../models/questions/MultipleSelectQuestion";
import { useState } from "react";
import { getBackgroundColor, getBorderColor, getCheckboxIndicator } from "../../../models/ColorCode";
import { QuestionPromptTemplate } from "../question-prompt-template";
import { QuestionExplanationTemplate } from "../question-explanation-template";
import { getGradingColor } from "../../../controllers/grading-color";


export const MultipleSelectReviewView: QuestionEditor<MultipleSelectQuestion> = ({ question }) => {
    const [userInput] = useState<string[]>(() => {
        const tmp: string[] = [];
        question.getUserInput().forEach((selected, index) => {
            if(selected) {
                tmp.push(index.toString());
            }
        })
        return tmp;
    });
    const [percentage] = useState<number>(Number.parseFloat((question.getResult() * 100).toFixed(2)));



    const cards = question.getOptions().map((option, index) => (
        <Checkbox.Card 
            value={index.toString()} 
            key={index} 
            p={12}
            style={{ 
                borderColor: getBorderColor(question.isCorrect(index), question.isSelected(index)), 
                backgroundColor: getBackgroundColor(question.isCorrect(index), question.isSelected(index)) 
            }}>
            <Group wrap="nowrap" align="flex-start">
                {getCheckboxIndicator(question.isCorrect(index), question.isSelected(index))}
                <Text>{option.label}</Text>
            </Group>
        </Checkbox.Card>
    ));

    return(
        <div>
            <Card withBorder mb={12}>
                <Group justify="center">
                    <RingProgress
                        sections={[{ value: percentage, color: getGradingColor(percentage) }]}
                        size={100}
                        thickness={4}
                        roundCaps
                        label={<Text c={getGradingColor(percentage)} ta="center" size="md" fw={600}>{question.getResult()} / 1</Text>}
                    />
                    <div>
                        <Text size="md" fw={500}>{percentage / 100} / 1</Text>
                        <Text c="dimmed" size="xs">Multiple Select Question</Text>
                    </div>
                </Group>
            </Card>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />
            <Checkbox.Group
                value={userInput}
            >
                <Stack pb="md" gap="xs">
                {cards}
                </Stack>
            </Checkbox.Group>
            <QuestionExplanationTemplate explanation={question.getExplanation()} />
        </div>
    );
}