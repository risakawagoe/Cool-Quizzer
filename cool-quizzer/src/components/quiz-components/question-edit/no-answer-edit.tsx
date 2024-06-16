import { QuestionEditor } from "../../../models/QuestionEditor";
import { Button, Group } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { NoAnswerQuestion } from "../../../models/questions/NoAnswerQuestion";
import { useState } from "react";
import { FieldRichTextEditor } from "../rich-text-editor";
import { AttachmentUploader } from "../templates/attachment-uploader-template";


export const NoAnswerEditView: QuestionEditor<NoAnswerQuestion> = ({ question, saveQuestion }) => {
    const [prompt, setPrompt] = useInputState(question.getPrompt());
    const [explanation, setExplanation] = useInputState(question.getExplanation());
    const [attachment, setAttachment] = useState<File | string | null>(question.getAttachment());

    const updateQuestion = () => {
        const updatedQuestion: NoAnswerQuestion = new NoAnswerQuestion();
        updatedQuestion.setPrompt(prompt);
        updatedQuestion.setExplanation(explanation);
        updatedQuestion.setAttachment(attachment);
        saveQuestion(updatedQuestion);
    }

    return(
        <div>
            <FieldRichTextEditor field="Prompt" required={true} content={prompt} editable={true} updateContent={setPrompt} />
            <AttachmentUploader _attachment={attachment} saveUpdate={setAttachment} />
            <FieldRichTextEditor field="Explanation" required={false} content={explanation} editable={true} updateContent={setExplanation} />
            <Group justify="flex-end" mt={20}>
                <Button variant="outline" onClick={updateQuestion} disabled={prompt.trim().length === 0}>Save</Button>
            </Group>
        </div>
    );
}