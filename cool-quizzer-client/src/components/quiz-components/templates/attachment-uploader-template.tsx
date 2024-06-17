import { ActionIcon, AspectRatio, FileInput, Image, Overlay } from "@mantine/core";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";

interface Props {
    _attachment: File | string | null
    saveUpdate: (update: File | string | null) => void
}

export const AttachmentUploader: FC<Props> = ({ _attachment, saveUpdate }) => {
    const [attachment, setAttachment] = useState<File | string | null>(_attachment);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    useEffect(() => {
        if(_attachment instanceof File) {
            setUploadFile(_attachment);
        }
    }, [])

    function updateAttachment(file: File | null) {
        setUploadFile(file);
        setAttachment(file);
        saveUpdate(file);
    }
    function removeAttachment() {
        setUploadFile(null);
        setAttachment(null);
        saveUpdate(null);
    }

    return(
        <>
        <FileInput 
            value={uploadFile} 
            onChange={updateAttachment} 
            accept="image/png,image/jpeg" 
            label="Attachment" 
            placeholder="Select an image file"
            mb={12}
            rightSection={<IconPhoto style={{ width: '65%', height: '65%' }} stroke={1.4} />} />
        {(attachment) &&
            <AspectRatio ratio={16 / 9} w="100%" pos="relative" style={{ backgroundColor: '#E9ECEF' }} mb={12} >
                <div>
                    <Image 
                        src={attachment instanceof File ? URL.createObjectURL(attachment) : attachment} 
                        alt={attachment instanceof File ? attachment.name : ''} 
                        w="100%" 
                        h="100%" 
                        radius="sm" 
                        fit="contain" />
                </div>
                <Overlay backgroundOpacity={0}>
                    <ActionIcon size="xl" radius="xl" pos="absolute" right={12} bottom={12} variant="white" color="red">
                        <IconTrash stroke={1.2} onClick={removeAttachment} />
                    </ActionIcon>
                </Overlay>
            </AspectRatio>
        }
        </>
    )
}