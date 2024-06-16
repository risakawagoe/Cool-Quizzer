import { Card, Group, Text } from "@mantine/core";
import { NoAnswerQuestion } from "../../../models/questions/NoAnswerQuestion";
import { QuestionPromptTemplate } from "../templates/question-prompt-template";
import { QuestionExplanationTemplate } from "../templates/question-explanation-template";
import { IconCircleOff } from "@tabler/icons-react";
import { QuestionReviewer } from "../../../models/QuestionReviewer";


export const NoAnswerReviewView: QuestionReviewer<NoAnswerQuestion> = ({ question }) => {

    return(
        <div>
            <Card withBorder mb={12}>
                <Group justify="center">
                    <IconCircleOff width={80} height={80} stroke={1} color="gray" />
                    <div>
                        <Text size="md" fw={500}>Not for points</Text>
                        <Text c="dimmed" size="xs">No Answer Question</Text>
                    </div>
                </Group>
            </Card>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />
            <QuestionExplanationTemplate explanation={question.getExplanation()} />
        </div>
    );
}