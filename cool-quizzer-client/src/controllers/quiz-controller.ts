import { Quiz, QuizOverview, QuizStats } from "../models/Quiz";

export async function createQuiz(quiz: Quiz): Promise<boolean> {
    if(process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT === undefined) {
        return false;
    }

    try {
        const serializableQuiz = await quiz.getSerializableObject();
        const response = await fetch(`${process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT}/api/quiz`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quiz: serializableQuiz }),
        });
        if(response.status === 201) {
            const result = await response.json();
            return result.success;
        }
    }catch(error) {
        console.error(error);
    }
    return false;
}

export async function updateQuiz(id: string, quiz: Quiz): Promise<boolean> {
    if(process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT === undefined) {
        return false;
    }

    try {
        const serializableQuiz = await quiz.getSerializableObject();
        const response = await fetch(`${process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT}/api/quiz/${id}`, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quiz: serializableQuiz }),
        });

        if(response.status === 204) {
            return true;
        }
    }catch(error) {
        console.error(error);
    }
    return false;
}

export async function updateQuizStats(id: string, stats: QuizStats): Promise<boolean> {
    if(process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT === undefined) {
        return false;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT}/api/stats/${id}`, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ stats: stats }),
        });

        if(response.status === 204) {
            return true;
        }
    }catch(error) {
        console.error(error);
    }
    return false;
}

export async function getAllQuizzes(): Promise<{ success: boolean, data: QuizOverview[] }> {
    if(process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT === undefined) {
        return { success: false, data: [] };
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT}/api/quiz`, {
            method: "GET",
            mode: "cors",
        });

        if(response.ok) {
            const quizzes: QuizOverview[] = [];
            const result = await response.json();
            if(Array.isArray(result.data)) {
                result.data.forEach((item: any) => {
                    quizzes.push(new QuizOverview(item.id, item.title, item.description, item.count, item.stats));
                })
                return { success: true, data: quizzes };
            }
        }
    }catch(error) {
        console.error(error);
    }
    return { success: false, data: [] };
}

export async function getQuiz(id: string): Promise<{ success: boolean, data: Quiz | null }> {
    if(process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT === undefined) {
        return { success: false, data: null };
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT}/api/quiz/${id}`, {
            method: "GET",
            mode: "cors"
        });

        if(response.ok) {
            const result = await response.json();
            const deserialized: Quiz | null = Quiz.deserialize(result.data);
            return { success: result.success && deserialized !== null, data: deserialized }; 
        }
    }catch(error) {
        console.log(error);
    }
    return { success: false, data: null };
}

export async function deleteQuiz(id: string): Promise<boolean> {
    if(process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT === undefined) {
        return false;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT}/api/quiz/${id}`, {
            method: "DELETE",
            mode: "cors"
        });

        if(response.status === 204) {
            return true;
        }
    } catch(error) {
        console.error(error);
    }
    return false;
}

export async function getSimilarityScore(text1: string, text2: string): Promise<number> {
    const invalidParams: boolean = text1.trim().length === 0 || text2.trim().length === 0;
    const serviceUndefined: boolean = process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT === undefined;
    if(invalidParams || serviceUndefined) {
        return 0;
    }

    try {
        const url = `${process.env.REACT_APP_QUIZ_SERVICE_ENDPOINT}/api/marking/shortanswer?text1=${text1}&text2=${text2}`;
        const response = await fetch(url, {
            method: "GET",
            mode: "cors"
        });

        if(response.ok) {
            const result = await response.json();
            return result.data;
        }
    }catch(error) {
        console.error(error);
    }

    return 0;
}