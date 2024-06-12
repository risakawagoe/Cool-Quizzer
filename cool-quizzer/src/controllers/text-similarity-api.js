const API_ENDPOINT = "https://twinword-text-similarity-v1.p.rapidapi.com/similarity";
const API_KEY = "4e19747b3fmsh97052e401cac8a8p182a87jsn5be3ad2f98d0";
const API_HOST = "twinword-text-similarity-v1.p.rapidapi.com";

export async function getSimilarityScore(text1, text2) {
    if(text1.trim().length === 0 || text2.trim().length === 0) {
        return 0;
    }

    console.log('text1: ' + text1);
    console.log('text2: ' + text2);
    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST
        }
    };
    
    try {
        const url = `${API_ENDPOINT}/?text1=${text1}&text2=${text2}`;
        const response = await fetch(url, options);
        if(response.ok) {
            const result = await response.json();
            console.log('done with result: ' + result.similarity);
            return result.similarity;
        }
        console.log('done: 0')
        return 0;
    } catch (error) {
        console.error(error);
        console.log('done with error: 0')
        return 0;
    }
}