import { ShortAnswerQuestion } from "../../../models/questions/ShortAnswerQuestion";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { Button, Group, Textarea } from "@mantine/core";
import { useInputState } from "@mantine/hooks";


export const ShortAnswerEditView: QuestionEditor<ShortAnswerQuestion> = ({ question }) => {
    const [prompt, setPrompt] = useInputState(question.getPrompt());
    const [correctAnswer, setCorrectAnswer] = useInputState(question.getAnswer());

    return(
        <div>
            <Textarea
                label="Prompt"
                description={getQuestionTypeLabel(question.type)}
                value={prompt}
                onChange={setPrompt}
                required
                />
            <Textarea
                label="Correct answer"
                value={correctAnswer}
                onChange={setCorrectAnswer}
                required
                />
            <Group justify="flex-end" mt={20}>
                <Button variant="outline">Save</Button>
            </Group>
        </div>
    );
}