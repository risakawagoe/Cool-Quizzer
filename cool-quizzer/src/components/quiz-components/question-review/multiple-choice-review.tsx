import { Card, Flex, Group, Radio, Stack, Text } from "@mantine/core";
import { MultipleChoiceQuestion } from "../../../models/questions/MultipleChoiceQuestion";
import { COLOR_CORRECT, COLOR_INCORRECT, getBackgroundColor, getBorderColor, getRadioIndicator } from "../../../models/ColorCode";
import { QuestionPromptTemplate } from "../question-prompt-template";
import { QuestionExplanationTemplate } from "../question-explanation-template";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { QuestionReviewer } from "../../../models/QuestionReviewer";


export const MultipleChoiceReviewView: QuestionReviewer<MultipleChoiceQuestion> = ({ question }) => {
    const [isCorrect, setIsCorrect] = useState<boolean>(false);

    useEffect(() => {
        async function init() {
            const score = await question.getScore(true);
            setIsCorrect(score === 1);
        }
        init();
    }, [])

    const cards = question.getOptions().map((option, index) => (
        <Flex key={index} gap={8} align="center" >
            <Radio.Card 
                value={index.toString()} 
                key={index} 
                p={12} 
                style={{ 
                    borderColor: getBorderColor(question.isCorrect(index), question.isSelected(index)), 
                    backgroundColor: getBackgroundColor(question.isCorrect(index), question.isSelected(index)) 
                }}>
                <Group wrap="nowrap" align="center">
                    {getRadioIndicator(question.isCorrect(index), question.isSelected(index))}
                    <Text>{option}</Text>
                </Group>
            </Radio.Card>
        </Flex>
    ));

    return(
        <div>
            <Card withBorder mb={12}>
                <Group justify="center">
                    {isCorrect ? <IconCircleCheck width={80} height={80} stroke={1} color={COLOR_CORRECT} /> : <IconCircleX width={80} height={80} stroke={1} color={COLOR_INCORRECT} />}
                    <div>
                        <Text size="md" fw={500}>{isCorrect ? '1' : '0'} / 1</Text>
                        <Text c="dimmed" size="xs">Multiple Choice Question</Text>
                    </div>
                </Group>
            </Card>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />
            <Radio.Group
                value={question.getUserInput().toString()}
                withAsterisk
            >
                <Stack pb="md" gap="xs">
                {question.getOptions().length === 0 && <Text size="sm" c="gray">No options.</Text>}
                {cards}
              </Stack>
            </Radio.Group>
            <QuestionExplanationTemplate explanation={question.getExplanation()} />
        </div>
    );
}