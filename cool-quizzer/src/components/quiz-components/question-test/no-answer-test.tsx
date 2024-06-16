import { QuestionEditor } from "../../../models/QuestionEditor";
import { NoAnswerQuestion } from "../../../models/questions/NoAnswerQuestion";
import { QuestionPromptTemplate } from "../templates/question-prompt-template";
import { Notification } from "@mantine/core";


export const NoAnswerTestView: QuestionEditor<NoAnswerQuestion> = ({ question }) => {
    return(
        <div>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />
            <Notification withCloseButton={false} withBorder>No answers expected.</Notification>
        </div>
    );
}