import { FC, useEffect, useState } from 'react';
import { InputLabel, TypographyStylesProvider } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';

import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';

// languages
import ts from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import c from 'highlight.js/lib/languages/c';
import json from 'highlight.js/lib/languages/json';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import html from 'highlight.js/lib/languages/vbscript-html';
import css from 'highlight.js/lib/languages/css';
import kotlin from 'highlight.js/lib/languages/kotlin';
import csharp from 'highlight.js/lib/languages/csharp';
import cpp from 'highlight.js/lib/languages/cpp';
import swift from 'highlight.js/lib/languages/swift';
import ruby from 'highlight.js/lib/languages/ruby';
import matlab from 'highlight.js/lib/languages/matlab';

const lowlight = createLowlight();
lowlight.register({ ts, python, c, json, cpp, java, kotlin, php, html, css, javascript, csharp, swift, ruby, matlab });


interface Props {
    field: string
    required: boolean
    content: string
    editable: boolean
    updateContent: (content: string) => void
}

export const FieldRichTextEditor: FC<Props> = ({ field, required, content, editable, updateContent }) => {
    const [currentContent, setCurrentContent] = useState(content);

    useEffect(() => {
        setCurrentContent(content);
    }, [content])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => updateContent(editor.getHTML()),
    editable: editable,
  });

  const editableView = (
    <RichTextEditor editor={editor} mb={12} w="100%">
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Underline />
        <RichTextEditor.Strikethrough />
        <RichTextEditor.ClearFormatting />
        <RichTextEditor.Highlight />
        <RichTextEditor.CodeBlock />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
        <RichTextEditor.H4 />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Blockquote />
        <RichTextEditor.Hr />
        <RichTextEditor.BulletList />
        <RichTextEditor.OrderedList />
        <RichTextEditor.Subscript />
        <RichTextEditor.Superscript />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Link />
        <RichTextEditor.Unlink />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.AlignLeft />
        <RichTextEditor.AlignCenter />
        <RichTextEditor.AlignJustify />
        <RichTextEditor.AlignRight />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Undo />
        <RichTextEditor.Redo />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content w="100%" style={{ wordWrap: "break-word", wordBreak: "break-word", overflowWrap: "break-word" }} />
  </RichTextEditor>
  );

  const displayView = (
    <TypographyStylesProvider mb={12} w="100%">
      <div dangerouslySetInnerHTML={{ __html: currentContent }} style={{ wordWrap: "break-word", wordBreak: "break-word", overflowWrap: "break-word" }}/>
    </TypographyStylesProvider>
    // <RichTextEditor editor={editor} mb={12} w="100%" style={{ border: "none" }} >
    //   <RichTextEditor.Content w="100%" p={0} style={{ wordWrap: "break-word", wordBreak: "break-word", overflowWrap: "break-word" }} />
    // </RichTextEditor>
  );


  return (
    <>
      {field.trim().length > 0 && <InputLabel required={required} mb={4}>{field}</InputLabel>}
      {editable ? editableView : displayView}
    </>
  );
}