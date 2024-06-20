import { ShortAnswerQuestion } from "../../../models/questions/ShortAnswerQuestion";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { Button, Group, Textarea } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useState } from "react";
import { FieldRichTextEditor } from "../rich-text-editor";
import { AttachmentUploader } from "../templates/attachment-uploader-template";


export const ShortAnswerEditView: QuestionEditor<ShortAnswerQuestion> = ({ question, saveQuestion }) => {
    const [prompt, setPrompt] = useInputState(question.getPrompt());
    const [explanation, setExplanation] = useInputState(question.getExplanation());
    const [attachment, setAttachment] = useState<File | string | null>(question.getAttachment());
    const [correctAnswer, setCorrectAnswer] = useInputState(question.getAnswer());

    const updateQuestion = () => {
        const updatedQuestion: ShortAnswerQuestion = new ShortAnswerQuestion();
        updatedQuestion.setPrompt(prompt);
        updatedQuestion.setExplanation(explanation);
        updatedQuestion.setAttachment(attachment);
        updatedQuestion.setAnswers(correctAnswer);
        saveQuestion(updatedQuestion);
    }

    return(
        <div>
            <FieldRichTextEditor field="Prompt" required={true} content={prompt} editable={true} updateContent={setPrompt} />
            <AttachmentUploader _attachment={attachment} saveUpdate={setAttachment} />
            <Textarea
                label="Correct answer"
                value={correctAnswer}
                onChange={setCorrectAnswer}
                required
                autosize
                size="md"
                mb={12}
                />
            <FieldRichTextEditor field="Explanation" required={false} content={explanation} editable={true} updateContent={setExplanation} />
            <Group justify="flex-end" mt={20}>
                <Button variant="outline" onClick={updateQuestion} disabled={prompt.trim().length === 0 || correctAnswer.trim().length === 0}>Save</Button>
            </Group>
        </div>
    );
}