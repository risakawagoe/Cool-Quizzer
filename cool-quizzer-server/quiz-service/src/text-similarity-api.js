const getSimilarityScore = async (text1, text2) => {
    if(text1.trim().length === 0 || text2.trim().length === 0) {
        return 0;
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_TWINWORD_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_TWINWORD_HOST
        }
    };
    
    try {
        const url = `${process.env.RAPIDAPI_TWINWORD_ENDPOINT}/?text1=${text1}&text2=${text2}`;
        const response = await fetch(url, options);
        if(response.ok) {
            const result = await response.json();
            return result.similarity;
        }
        return 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

module.exports = { getSimilarityScore };