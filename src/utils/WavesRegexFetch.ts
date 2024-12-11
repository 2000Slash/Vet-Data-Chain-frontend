import axios from 'axios';
function customEncodeURIComponent(str: string): string {
    return encodeURIComponent(str)
        .replace(/\*/g, '%2A') // Encode '*'
        .replace(/\^/g, '%5E') // Encode '^'
        .replace(/\$/g, '%24'); // Encode '$' Nils zeigen wie er ohne das macht
}

async function fetchRegexData(nodeURL: string, walletAddress: string, regex: string){
    try {
        const url = `${nodeURL}/addresses/data/${walletAddress}?matches=${customEncodeURIComponent(regex)}`;
        const response = await axios.get(url, {
            headers: {
                'accept': 'application/json',
            },
        });
        return response.data; // Key und value zurück geben 
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
}

export default fetchRegexData;