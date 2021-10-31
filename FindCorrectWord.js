const SpellChecker = require('simple-spellchecker');
const FuzzyMatching = require('fuzzy-matching');

class FindCorrectWord {

    static #fuzzyObj;

    static async initDictonary() {
        const dict = await SpellChecker.getDictionarySync('tokens', '.');
        FindCorrectWord.#fuzzyObj = new FuzzyMatching(dict.wordlist);
    }

    static getCorrectWord(word) {
        const fuzzyCheck = FindCorrectWord.#fuzzyObj.get(word);
        if (fuzzyCheck.distance > 0.75) {
            return fuzzyCheck.value;
        }
        return word;
    }
}

module.exports = {
    FindCorrectWord
}