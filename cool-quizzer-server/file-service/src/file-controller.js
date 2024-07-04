const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("./firebase");
const { generateUniqueFilename } = require("./util");
// const { v4 } = require("uuid");

const FILE_UPLOADS_DIR = "uploads";

const uploadFile = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: "Request did not contain any files." })
    }

    const storageRef = ref(storage, `${FILE_UPLOADS_DIR}/${generateUniqueFilename(file.originalname)}`);
    // const storageRef = ref(storage, `${FILE_UPLOADS_DIR}/${file.originalname + v4()}`);
    try {
        const snapshot = await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });
        const fileURL = await getDownloadURL(snapshot.ref);
        return res.status(200).json({ success: true, url: fileURL });
    }catch(error) {
        return res.status(500).json({ success: false, message: "Firebase Cloud Storage operation failed." });
    }
}

const uploadFiles = async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: "Request did not contain any files." })
    }

    const items = [];
    files.forEach(file => items.push({
        storageRef: ref(storage, `${FILE_UPLOADS_DIR}/${generateUniqueFilename(file.originalname)}`),
        // storageRef: ref(storage, `${FILE_UPLOADS_DIR}/${file.originalname + v4()}`),
        file: file.buffer,
        contentType: file.mimetype
    }));

    try {
        const uploadPromises = items.map(item => uploadBytes(item.storageRef, item.file, { contentType: item.contentType }));
        const snapshots = await Promise.all(uploadPromises);

        const urlPromises = snapshots.map(snapshot => getDownloadURL(snapshot.ref));
        const urls = await Promise.all(urlPromises);
        return res.status(200).json({ success: true, urls: urls });
    }catch(error) {
        return res.status(500).json({ success: false, message: "Firebase Cloud Storage operation failed." });
    }
}

module.exports = { uploadFile };