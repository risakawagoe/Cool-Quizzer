import { Card, Group, InputLabel, RingProgress, Text, Textarea, Title } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { ShortAnswerQuestion } from "../../../models/questions/ShortAnswerQuestion";
import { QuestionPromptTemplate } from "../question-prompt-template";
import { QuestionExplanationTemplate } from "../question-explanation-template";
import { useEffect, useState } from "react";
import { getSimilarityScore } from "../../../controllers/text-similarity-api";
import { getGradingColor } from "../../../controllers/grading-color";


export const ShortAnswerReviewView: QuestionEditor<ShortAnswerQuestion> = ({ question }) => {
    const [percentage, setPercentage] = useState<number>(62.82);

    useEffect(() => {
        async function init() {
            const similarity: number = await getSimilarityScore(question.getUserInput(), question.getAnswer());
            setPercentage(Math.round(similarity * 100) / 100);
        }
        // init();
    }, [])

    return(
        <div>
            <Card withBorder mb={12}>
                <Group justify="center">
                    <RingProgress
                        sections={[{ value: percentage, color: getGradingColor(percentage) }]}
                        size={100}
                        thickness={4}
                        roundCaps
                        label={<Text c={getGradingColor(percentage)} ta="center" size="md" fw={600}>{percentage}%</Text>}
                    />
                    <div>
                        <Text size="md" fw={500}>Similarirt Score</Text>
                        <Text c="dimmed" size="xs">Short Answer Question</Text>
                    </div>
                </Group>
            </Card>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />


            <Textarea 
                label="Your Answer"
                value={question.getUserInput()}
                disabled
                mb={12}
            />
            <InputLabel>Correct Answer</InputLabel>
            <Text w="100%" mb={12} style={{ wordWrap: "break-word", wordBreak: "break-word" }} >{question.getAnswer()}</Text>
            
            <QuestionExplanationTemplate explanation={question.getExplanation()} />
        </div>
    );
}