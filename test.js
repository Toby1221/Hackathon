

function firstNonRepeatingLetter(s) {
    // Iterate through each character in the string
    for (let i = 0; i < s.length; i++) {
        // Char is set to the current character
        const char = s[i];
        // Check if the character is non-repeating (case insensitive)
        if (s.toLowerCase().indexOf(char.toLowerCase()) === s.toLowerCase().lastIndexOf(char.toLowerCase())) {
            // Return the first non-repeating character
            return char;
        }
    }
    // If no non-repeating character is found, return an empty string
    return '';
}

//solve the above function using regex
//example: firstNonRepeatingLetter("sTreSS") should return "T"
//example: firstNonRepeatingLetter("aabbcc") should return ""
//example: firstNonRepeatingLetter("moonmen") should return "e"
//example: firstNonRepeatingLetter("aA") should return ""
function firstNonRepeatingLetterRegex(s) {
    // Create a regex pattern to match non-repeating characters
    const pattern = /(.)(?<!\1.+)(?!.*\1)/ig;
    const matches = s.match(pattern);
    // Return the first match or an empty string if none found
    return matches ? matches[0] : '';

    return s.match(/(.)(?<!\1.+)(?!.*\1)/ig) ?.[0] || '';
}

