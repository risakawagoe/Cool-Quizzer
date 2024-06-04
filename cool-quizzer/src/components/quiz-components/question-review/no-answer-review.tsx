import { Card, Group, Text } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { NoAnswerQuestion } from "../../../models/questions/NoAnswerQuestion";
import { QuestionPromptTemplate } from "../question-prompt-template";
import { QuestionExplanationTemplate } from "../question-explanation-template";
import { IconCircleOff } from "@tabler/icons-react";


export const NoAnswerReviewView: QuestionEditor<NoAnswerQuestion> = ({ question }) => {

    return(
        <div>
            <Card withBorder mb={12}>
                <Group justify="center">
                    <IconCircleOff width={80} height={80} stroke={1} color="gray" />
                    <div>
                        <Text size="md" fw={500}>0 / 0</Text>
                        <Text c="dimmed" size="xs">No Answer Question</Text>
                    </div>
                </Group>
            </Card>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />
            <QuestionExplanationTemplate explanation={question.getExplanation()} />
        </div>
    );
}