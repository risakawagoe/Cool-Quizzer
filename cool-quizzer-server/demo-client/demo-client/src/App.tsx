import { useState } from 'react';
import './App.css';
import { useInputState } from '@mantine/hooks';
import { Button, Container, Divider, FileInput, Group, Text } from '@mantine/core';

function App() {
    const [file, setFile] = useInputState<File | null>(null);
    const [files, setFiles] = useInputState<File[]>([]);
    const [res, setRes] = useState('');

    async function uploadFile() {
        if(!file) return;

        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch("https://file-service-cdyocxqala-uc.a.run.app/api/file", {
                  method: "POST",
                  body: formData
            });
            const data = await response.json();
            setRes(data);
            console.log(data);

        }catch(error) {
            console.error(error);
        }
    }
    async function uploadFiles() {
        if(files.length === 0) return;

        const formData = new FormData();
        files.forEach(file => formData.append(file.name, file));

        try {
            const response = await fetch("https://file-service-cdyocxqala-uc.a.run.app/api/files", {
                  method: "POST",
                  body: formData
            });
            const data = await response.json();
            setRes(data);
            console.log(data);

        }catch(error) {
            console.error(error);
        }
    }
  return (
    <Container maw={540} ml="auto" mr="auto">
        <Group gap={8} mt={12} align='flex-end'>
            <FileInput flex={1} label="File (single)" value={file} onChange={setFile} />
            <Button variant='subtle' onClick={uploadFile}>Upload Single File</Button>
        </Group>
        {/* <Group gap={8} mt={12} align='flex-end'>
            <FileInput flex={1} label="Files (multiple)" value={files} multiple onChange={setFiles} />
            <Button variant='subtle' onClick={uploadFiles}>Upload Multiple Files</Button>
        </Group> */}
        <Divider size="md" mt={12} mb={12} />
        <Text size='sm' fw={500}>Response</Text>
        <pre style={{ width: "100%", textWrap: "wrap", wordBreak: "break-word" }}>{JSON.stringify(res, null, 2)}</pre>
    </Container>
  );
}

export default App;
