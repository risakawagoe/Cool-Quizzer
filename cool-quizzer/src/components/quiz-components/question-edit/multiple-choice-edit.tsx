import { ActionIcon, AspectRatio, Button, Center, CheckIcon, FileInput, Flex, Group, Image, InputLabel, Overlay, Radio, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { MultipleChoiceQuestion } from "../../../models/questions/MultipleChoiceQuestion";
import { useInputState, useListState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IconPhoto, IconPlus, IconTrash } from "@tabler/icons-react";
import { COLOR_CORRECT } from "../../../models/ColorCode";
import { FieldRichTextEditor } from "../rich-text-editor";


export const MultipleChoiceEditView: QuestionEditor<MultipleChoiceQuestion> = ({ question, saveQuestion }) => {
    const [prompt, setPrompt] = useInputState(question.getPrompt());
    const [explanation, setExplanation] = useInputState(question.getExplanation());
    const [attachment, setAttachment] = useState<File | null>(question.getAttachment());
    const [options, optionsHandlers] = useListState<string>([...question.getOptions()]);
    const [correctAnswer, setCorrectAnswer] = useState(question.getAnswer().toString());
    const [newOption, setNewOption] = useInputState('');

    useEffect(() => {
        if(options.length === 1) {
            setCorrectAnswer('0');
        }
    }, [options])

    const cards = options.map((option, index) => (
        <Flex key={index} gap={8} align="center">
            <Radio.Card value={index.toString()} key={index} p={12}>
                <Group wrap="nowrap" align="center">
                    <Radio.Indicator variant="outline" radius="lg" icon={CheckIcon} color={COLOR_CORRECT} />
                    <Text>{option}</Text>
                </Group>
            </Radio.Card>
            <ActionIcon variant="transparent" color="red" aria-label="Settings">
                <IconTrash style={{ width: '80%', height: '80%' }} stroke={1.5} onClick={() => removeOption(index)} />
            </ActionIcon>
        </Flex>
    ));

    function addOption() {
        optionsHandlers.append(newOption);
        setNewOption('');
    }

    function updateQuestion() {
        const updatedQuestion: MultipleChoiceQuestion = new MultipleChoiceQuestion();
        updatedQuestion.setPrompt(prompt);
        updatedQuestion.setExplanation(explanation);
        updatedQuestion.setAttachment(attachment);
        updatedQuestion.setOptions(options);
        updatedQuestion.setAnswers(Number.parseInt(correctAnswer));
        saveQuestion(updatedQuestion);
    }

    function removeOption(index: number) {
        const isValidIndex = index >= 0 && index < options.length;
        if(isValidIndex) {
            if(correctAnswer === index.toString()) {
                const alternativeAnswer: number = options.length >= 2 ? 0 : -1;
                setCorrectAnswer(alternativeAnswer.toString());
            }else if(Number.parseInt(correctAnswer) > index) {
                setCorrectAnswer((Number.parseInt(correctAnswer) - 1).toString());
            }
            optionsHandlers.remove(index);
        }
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
            <Radio.Group
                label="Options"
                value={correctAnswer}
                onChange={setCorrectAnswer}
                withAsterisk
                required
            >
              <Stack pb="md" gap="xs">
                {options.length === 0 && <Text size="sm" c="gray">No options.</Text>}
                {cards}
              </Stack>
            </Radio.Group>

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