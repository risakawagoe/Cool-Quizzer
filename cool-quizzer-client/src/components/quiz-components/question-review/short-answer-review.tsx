import { Card, Group, InputLabel, RingProgress, Text, Textarea } from "@mantine/core";
import { ShortAnswerQuestion } from "../../../models/questions/ShortAnswerQuestion";
import { QuestionPromptTemplate } from "../templates/question-prompt-template";
import { QuestionExplanationTemplate } from "../templates/question-explanation-template";
import { useEffect, useState } from "react";
import { getGradingColor } from "../../../utils/grading-color";
import { QuestionReviewer } from "../../../models/QuestionReviewer";


export const ShortAnswerReviewView: QuestionReviewer<ShortAnswerQuestion> = ({ config, question }) => {
    const [percentage, setPercentage] = useState<number>(0);

    useEffect(() => {
        async function init() {
            const score = await question.getScore(config.autoMarking);
            setPercentage(score * 100);
        }
        init();
    }, [])

    return(
        <div>
            <Card withBorder mb={12}>
                <Group justify="center">
                    {config.autoMarking &&
                        <RingProgress
                            sections={[{ value: percentage, color: getGradingColor(percentage) }]}
                            size={100}
                            thickness={4}
                            roundCaps
                            label={<Text c={getGradingColor(percentage)} ta="center" size="md" fw={600}>{percentage}%</Text>}
                        />
                    }
                    {!config.autoMarking &&
                        <RingProgress
                            sections={[{ value: 0, color: "gray" }]}
                            size={100}
                            thickness={4}
                            roundCaps
                            label={<Text c="gray" ta="center" size="md" fw={600}>--%</Text>}
                        />
                    }
                    <div>
                        {config.autoMarking ? <Text size="md" fw={500}>Similarirt Score</Text> : <Text size="md" fw={500}>Auto Marking OFF</Text>}
                        <Text c="dimmed" size="xs">Short Answer Question</Text>
                    </div>
                </Group>
            </Card>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />


            <Textarea 
                label="Your Answer"
                value={question.getUserInput()}
                disabled
                autosize
                mb={12}
            />
            <InputLabel>Correct Answer</InputLabel>
            <Text w="100%" mb={12} style={{ wordWrap: "break-word", wordBreak: "break-word" }} >{question.getAnswer()}</Text>
            
            <QuestionExplanationTemplate explanation={question.getExplanation()} />
        </div>
    );
}