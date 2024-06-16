import { ref, uploadBytes, getDownloadURL, StorageReference, UploadResult } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

export async function uploadFile(file: File): Promise<{ success: boolean, url: string}> {
    const storageRef = ref(storage, `uploads/${file.name + v4()}`);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Uploaded your file!');
        const fileURL = await getDownloadURL(snapshot.ref);
        console.log(fileURL);
        return {success: true, url: fileURL};
    }catch(error) {
        console.log('Uplaod failed');
        return {success: false, url: ''};
    }
}
export async function uploadFiles(files: Array<File>): Promise<{ success: boolean, urls: string[]}> {
    const items: Array<{ storageRef: StorageReference, file: File}> = [];
    files.forEach(file => items.push({
        storageRef: ref(storage, `uploads/${file.name + v4()}`),
        file: file
    }));

    try {
        const uploadPromises = items.map(item => uploadBytes(item.storageRef, item.file));
        const snapshots = await Promise.all(uploadPromises);
        console.log('Uploaded all files!');

        const URLPromises = snapshots.map(snapshot => getDownloadURL(snapshot.ref));
        const URLs = await Promise.all(URLPromises);
        console.log(URLs);
        return {success: true, urls: URLs};
    }catch(error) {
        console.log('Uplaod failed');
        return {success: false, urls: []};
    }
}