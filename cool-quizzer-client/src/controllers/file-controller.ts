export async function uploadFile(file: File): Promise<{ success: boolean, url: string}> {
    if(process.env.REACT_APP_FILE_SERVICE_ENDPOINT === undefined) {
        return { success: false, url: '' };
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${process.env.REACT_APP_FILE_SERVICE_ENDPOINT}/api/file`, {
            method: "POST",
            mode: "cors",
            body: formData
        });

        if(response.ok) {
            const result = await response.json();
            return result;
        }
    }catch(error) {
        console.error(error);
    }
    return { success: false, url: '' };
}