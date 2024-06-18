const { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } = require("firebase/firestore");
const { db } = require("./firebase");

const DB_COLLECTION_NAME = "quizzes";

const quizOverviewConverter = {
    toFirestore: (quiz) => {
        return {};
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id, 
            title: data.title, 
            description: data.description, 
            count: data.count, 
            stats: data.stats
        };
    }
};

const createQuiz = async (req, res) => {
    const quiz = req.body.quiz;
    if(quiz === undefined) {
        res.status(400).json({ success: false, message: "Request missing quiz data." });
    }

    try {
        const docRef = await addDoc(collection(db, DB_COLLECTION_NAME), quiz);
        res.status(201).json({ success: true, id: docRef.id });
    }catch(error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Firestore operation failed." });
    }
}

const getQuiz = async (req, res) => {
    const id = req.params.id;
    if(id === undefined) {
        res.status(400).json({ success: false, message: "Request missing quiz id." });
    }

    try {
        const docRef = doc(db, DB_COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            res.status(200).json({ success: true, data: docSnap.data() });
        } else {
            res.status(404).json({ success: false, message: "Quiz with given id does not exist." });
        }
    }catch(error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Firestore operation failed." });
    }
}
const getAllQuizzes = async (req, res) => {
    const quizzes = [];
    try {
        const querySnapshot = await getDocs(collection(db, DB_COLLECTION_NAME).withConverter(quizOverviewConverter));
        querySnapshot.forEach(doc => quizzes.push(doc.data()));
        res.status(200).json({ success: true, data: quizzes });
    }catch(error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Firestore operation failed." });
    }
}

const updateQuiz = async (req, res) => {
    const id = req.params.id;
    const quiz = req.body.quiz;
    if(id === undefined || quiz === undefined) {
        res.status(400).json({ success: false, message: "Request missing quiz id or data." });
    }

    try {
        const docRef = doc(db, DB_COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, quiz);
            res.status(204).json({ success: true, message: "Quiz was successfully updated." });
        } else {
            res.status(404).json({ success: false, message: "Quiz with given id does not exist." });
        }
    }catch(error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Firestore operation failed." });
    }
}

const updateQuizStats = async (req, res) => {
    const id = req.params.id;
    const stats = req.body.stats;
    if(id === undefined || stats === undefined) {
        res.status(400).json({ success: false, message: "Request missing quiz id or data." });
    }

    try {
        const docRef = doc(db, DB_COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, { stats: stats });
            res.status(204).json({ success: true, message: "Quiz stats was successfully updated." });
        } else {
            res.status(404).json({ success: false, message: "Quiz with given id does not exist." });
        }
    }catch(error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Firestore operation failed." });
    }
}




const deleteQuiz = async (req, res) => {
    const id = req.params.id;
    if(id === undefined) {
        res.status(400).json({ success: false, message: "Request missing quiz id." });
    }
    
    try {
        const docRef = doc(db, DB_COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await deleteDoc(docRef);
            res.status(204).send({ success: true, message: "Quiz was successfully deleted."});
        } else {
            res.status(404).json({ success: false, message: "Quiz with given id does not exist." });
        }
    }catch(error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Firestore operation failed." });
    }
}

module.exports = { createQuiz, getQuiz, getAllQuizzes, updateQuiz, updateQuizStats, deleteQuiz };