import { Image } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { FieldRichTextEditor } from "../rich-text-editor"

interface Props {
    prompt: string
    attachment: File | string | null
}

export const QuestionPromptTemplate: FC<Props> = ({ prompt, attachment }) => {
    const [_prompt, setPrompt] = useState(prompt);
    const [_attachment, setAttachment] = useState(attachment);

    useEffect(() => {
        setPrompt(prompt);
        setAttachment(attachment);
    }, [prompt, attachment])
    return (
        <>
            <FieldRichTextEditor field="" required={false} content={_prompt} editable={false} updateContent={() => {}} />
            {_attachment && <Image 
                src={_attachment instanceof File ? URL.createObjectURL(_attachment) : _attachment} 
                alt={_attachment instanceof File ? _attachment.name : ''} 
                maw="100%" 
                w="auto" 
                h="auto" 
                mb={16} 
                radius="sm" />}
        </>
    )
}