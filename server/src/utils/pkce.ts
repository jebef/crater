// Utility functions to perform PKCE //
import crypto from 'crypto';

// returns a code verifier
export const generateCodeVerifier = (length: number): string => {
    // possible values for the code verifier per the PKCE standard 
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    // an array of random values of size 'length'
    const values = crypto.getRandomValues(new Uint8Array(length));
    // map 'values' to possible values and collapse array into a single string 
    const result = Array.from(values)
                    .map((value) => possible[value % possible.length])
                    .join('');
    return result;
};

// encode a string using the SHA256 algorithm 
export const sha256 = async (plain: string): Promise<ArrayBuffer> => {
    return crypto.createHash('sha256').update(plain).digest();
}

// returns the base64 representation of an array of bytes
export const base64encode = (input: ArrayBuffer): string =>  {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '') // sha256 does some padding, this gets rid of it
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
}