// "// Tools for proof key for code exchange (PKCE)

// // global constants 
// const clientID = 'bbf4860599f344e88623b1e6eab26dda';
// const redirectURI = 'http://127.0.0.1:3001/callback';

// const scope = 'user-read-private user-read-email';
// const authURL = new URL('https://accounts.spotify.com/authorize');



// const generateCodeVerifier = (length: number): string => {
//     // possible values for the code verifier per the PKCE standard 
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
//     // an array of random values of size 'length'
//     const values = crypto.getRandomValues(new Uint8Array(length));
//     // map 'values' to possible values and collapse array into a single string 
//     const result = Array.from(values)
//                     .map((value) => possible[value % possible.length])
//                     .join('');
//     return result;
// };

// // encode a string using the SHA256 algorithm 
// const sha256 = async (plain: string): Promise<ArrayBuffer> => {
//     const encoder = new TextEncoder();
//     // converts our plain text into a Uint8Array (raw bytes)
//     const data = encoder.encode(plain);
//     // run sha256
//     return window.crypto.subtle.digest('SHA-256', data);
// }

// // returns the base64 representation of an array of bytes
// const base64encode = (input: ArrayBuffer): string =>  {
//     return btoa(String.fromCharCode(...new Uint8Array(input)))
//             .replace(/=/g, '') // sha256 does some padding, this gets rid of it
//             .replace(/\+/g, '-')
//             .replace(/\//g, '_');
// }

// // request user authorization 
// const requestUserAuthorization(): 
