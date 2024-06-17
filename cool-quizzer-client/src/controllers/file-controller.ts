import { ref, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

export async function uploadFile(file: File): Promise<{ success: boolean, url: string}> {
    const storageRef = ref(storage, `uploads/${file.name + v4()}`);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const fileURL = await getDownloadURL(snapshot.ref);
        return {success: true, url: fileURL};
    }catch(error) {
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

        const URLPromises = snapshots.map(snapshot => getDownloadURL(snapshot.ref));
        const URLs = await Promise.all(URLPromises);
        return {success: true, urls: URLs};
    }catch(error) {
        return {success: false, urls: []};
    }
}