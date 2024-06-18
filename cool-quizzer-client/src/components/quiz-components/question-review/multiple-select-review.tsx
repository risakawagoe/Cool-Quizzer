import { Card, Checkbox, Group, RingProgress, Stack, Text } from "@mantine/core";
import { MultipleSelectQuestion } from "../../../models/questions/MultipleSelectQuestion";
import { useEffect, useState } from "react";
import { getBackgroundColor, getBorderColor, getCheckboxIndicator } from "../../../models/ColorCode";
import { QuestionPromptTemplate } from "../templates/question-prompt-template";
import { QuestionExplanationTemplate } from "../templates/question-explanation-template";
import { getGradingColor } from "../../../utils/grading-color";
import { QuestionReviewer } from "../../../models/QuestionReviewer";


export const MultipleSelectReviewView: QuestionReviewer<MultipleSelectQuestion> = ({ question }) => {
    const [userInput] = useState<string[]>(() => {
        const tmp: string[] = [];
        question.getUserInput().forEach((selected, index) => {
            if(selected) {
                tmp.push(index.toString());
            }
        })
        return tmp;
    });
    const [percentage, setPercentage] = useState<number>(0);

    useEffect(() => {
        async function init() {
            const score = await question.getScore(true);
            setPercentage(score * 100);
        }
        init();
    }, [])


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
                        label={<Text c={getGradingColor(percentage)} ta="center" size="md" fw={600}>{percentage / 100} / 1</Text>}
                    />
                    <div>
                        <Text size="md" fw={500}>{question.getCorrectSelectionCount()} correct, {question.getIncorrectSelectionCount()} incorrect</Text>
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