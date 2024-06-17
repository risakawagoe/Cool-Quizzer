import { FC } from "react"
import { FieldRichTextEditor } from "../rich-text-editor"

interface Props {
    explanation: string
}

export const QuestionExplanationTemplate: FC<Props> = ({ explanation }) => {
    return (
        <FieldRichTextEditor field="Explanation" required={false} content={explanation} editable={false} updateContent={() => {}} />
    )
}