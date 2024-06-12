import { QuestionEditor } from "../../../models/QuestionEditor";
import { ActionIcon, AspectRatio, Button, FileInput, Group, Image, Overlay } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { NoAnswerQuestion } from "../../../models/questions/NoAnswerQuestion";
import { useState } from "react";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { FieldRichTextEditor } from "../rich-text-editor";


export const NoAnswerEditView: QuestionEditor<NoAnswerQuestion> = ({ question, saveQuestion }) => {
    const [prompt, setPrompt] = useInputState(question.getPrompt());
    const [explanation, setExplanation] = useInputState(question.getExplanation());
    const [attachment, setAttachment] = useState<File | null>(question.getAttachment());

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
            <FileInput 
                value={attachment} 
                onChange={setAttachment} 
                accept="image/png,image/jpeg" 
                label="Attachment" 
                placeholder="Select an image file"
                mb={12}
                rightSection={<IconPhoto style={{ width: '65%', height: '65%' }} stroke={1.4} />} />
            {attachment &&
                <AspectRatio ratio={16 / 9} w="100%" pos="relative" style={{ backgroundColor: '#E9ECEF' }} mb={12} >
                    {<div><Image src={URL.createObjectURL(attachment)} alt={attachment.name} w="100%" h="100%" radius="sm" fit="contain" /></div>}
                    {<Overlay backgroundOpacity={0}>
                        <ActionIcon size="xl" radius="xl" pos="absolute" right={12} bottom={12} variant="white" color="red"><IconTrash stroke={1.2} onClick={() => setAttachment(null)} /></ActionIcon>
                        </Overlay>}
                </AspectRatio>
            }
            <FieldRichTextEditor field="Explanation" required={false} content={explanation} editable={true} updateContent={setExplanation} />
            <Group justify="flex-end" mt={20}>
                <Button variant="outline" onClick={updateQuestion} disabled={prompt.trim().length === 0}>Save</Button>
            </Group>
        </div>
    );
}