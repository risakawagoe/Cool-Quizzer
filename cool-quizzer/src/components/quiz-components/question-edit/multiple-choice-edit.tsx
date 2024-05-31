import { ActionIcon, Button, Flex, Group, Radio, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { MultipleChoiceQuestion } from "../../../models/questions/MultipleChoiceQuestion";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { useInputState, useListState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";


export const MultipleChoiceEditView: QuestionEditor<MultipleChoiceQuestion> = ({ question, saveQuestion }) => {
    const [prompt, setPrompt] = useInputState(question.getPrompt());
    const [options, optionsHandlers] = useListState<string>([...question.getOptions()]);
    const [correctAnswer, setCorrectAnswer] = useState(question.getAnswer().toString());
    const [newOption, setNewOption] = useInputState('');

    useEffect(() => {
        if(options.length === 1) {
            setCorrectAnswer('0');
        }
    }, [options])


    const addOption = () => {
        optionsHandlers.append(newOption);
        setNewOption('');
    }

    const updateQuestion = () => {
        const updatedQuestion: MultipleChoiceQuestion = new MultipleChoiceQuestion();
        updatedQuestion.setPrompt(prompt);
        updatedQuestion.setOptions(options);
        updatedQuestion.setAnswers(Number.parseInt(correctAnswer));
        saveQuestion(updatedQuestion);
    }

    const removeOption = (index: number) => {
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
            <Textarea
                label="Prompt"
                description={getQuestionTypeLabel(question.type)}
                value={prompt}
                onChange={setPrompt}
                required
                />
            <Radio.Group
                label="Options"
                value={correctAnswer}
                onChange={setCorrectAnswer}
                withAsterisk
                required
            >
              <Stack>
                {options.length === 0 && <Text size="sm" c="gray">No options.</Text>}
                {options.map((option, index) => (
                    <Flex key={index} justify={"space-between"} align="center">
                        <Radio value={index.toString()} label={option} />
                        <Group gap="xs">
                            <Button variant="default" size="xs" radius="xl" onClick={() => removeOption(index)}>Delete</Button>
                        </Group>
                    </Flex>
                ))}
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
            />

            <Group justify="flex-end" mt={20}>
                <Button variant="outline" onClick={updateQuestion}>Save</Button>
            </Group>
        </div>
    );
}