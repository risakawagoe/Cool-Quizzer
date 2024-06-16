import { ActionIcon, Button, Checkbox, Flex, Group, Stack, Text, TextInput } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { MultipleSelectQuestion, Option } from "../../../models/questions/MultipleSelectQuestion";
import { useState } from "react";
import { useInputState, useListState } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { COLOR_CORRECT } from "../../../models/ColorCode";
import { FieldRichTextEditor } from "../rich-text-editor";
import { AttachmentUploader } from "../templates/attachment-uploader-template";


export const MultipleSelectEditView: QuestionEditor<MultipleSelectQuestion> = ({ question, saveQuestion }) => {
    const [prompt, setPrompt] = useInputState(question.getPrompt());
    const [explanation, setExplanation] = useInputState(question.getExplanation());
    const [attachment, setAttachment] = useState<File | string | null>(question.getAttachment());
    const [options, optionsHandlers] = useListState<Option>([...question.getOptions()]);
    const [correctAnswer, setCorrectAnswer] = useState<string[]>(() => {
        const tmp: string[] = [];
        question.getOptions().forEach((option, index) => {
            if(option.isCorrect) {
                tmp.push(index.toString());
            }
        })
        return tmp;
    });
    const [newOption, setNewOption] = useInputState('');

    const cards = options.map((option, index) => (
        <Flex key={index} gap={8} align="center">
            <Checkbox.Card value={index.toString()} key={index} p={12}>
                <Group wrap="nowrap" align="center">
                    <Checkbox.Indicator variant="outline" radius="lg" color={COLOR_CORRECT} />
                    <Text>{option.label}</Text>
                </Group>
            </Checkbox.Card>
            <ActionIcon variant="transparent" color="red" aria-label="Settings">
                <IconTrash style={{ width: '80%', height: '80%' }} stroke={1.5} onClick={() => removeOption(index)} />
            </ActionIcon>
        </Flex>
    ));

    const addOption = () => {
        optionsHandlers.append({ label: newOption, isCorrect: false });
        setNewOption('');
    }

    const removeOption = (index: number) => {
        optionsHandlers.remove(index)

        const updatedCorrectAnswer = correctAnswer
            .filter(answer => answer !== index.toString())
            .map(answer => !Number.isNaN(Number.parseInt(answer)) && Number.parseInt(answer) > index ? (Number.parseInt(answer) - 1).toString() : answer);

        setCorrectAnswer([...updatedCorrectAnswer]);
    }

    const updateQuestion = () => {
        const updatedQuestion: MultipleSelectQuestion = new MultipleSelectQuestion();
        updatedQuestion.setPrompt(prompt);
        updatedQuestion.setExplanation(explanation);

        options.forEach((option, index) => {
            option.isCorrect = correctAnswer.includes(index.toString());
        })

        updatedQuestion.setAnswers(options);
        updatedQuestion.setAttachment(attachment);
        saveQuestion(updatedQuestion);
    }

    return(
        <div>
            <FieldRichTextEditor field="Prompt" required={true} content={prompt} editable={true} updateContent={setPrompt} />
            <AttachmentUploader _attachment={attachment} saveUpdate={setAttachment} />
            <Checkbox.Group
                label="Options"
                value={correctAnswer}
                onChange={setCorrectAnswer}
                required
            >
                <Stack pb="md" gap="xs">
                    {options.length === 0 && <Text size="sm" c="gray">No options.</Text>}
                    {cards}
                </Stack>
            </Checkbox.Group>
            <TextInput
                value={newOption}
                onChange={setNewOption}
                rightSection={<ActionIcon variant="subtle" aria-label="Settings" onClick={addOption} disabled={newOption.trim().length === 0}>
                                <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>}
                label="New option"
                placeholder="Type in a new option."
                mb={12}
            />
            <FieldRichTextEditor field="Explanation" required={false} content={explanation} editable={true} updateContent={setExplanation} />
            <Group justify="flex-end" mt={20}>
                <Button variant="outline" onClick={updateQuestion} disabled={prompt.trim().length === 0 || options.length === 0}>Save</Button>
            </Group>
        </div>
    );
}