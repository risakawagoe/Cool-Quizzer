import { QuestionEditor } from "../../../models/QuestionEditor";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { Button, Group, Textarea } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { NoAnswerQuestion } from "../../../models/questions/NoAnswerQuestion";


export const NoAnswerEditView: QuestionEditor<NoAnswerQuestion> = ({ question }) => {
    const [prompt, setPrompt] = useInputState(question.getPrompt());

    return(
        <div>
            <Textarea
                label="Prompt"
                description={getQuestionTypeLabel(question.type)}
                value={prompt}
                onChange={setPrompt}
                required
                />
            <Group justify="flex-end" mt={20}>
                <Button variant="outline">Save</Button>
            </Group>
        </div>
    );
}