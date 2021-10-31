const SpellChecker = require('simple-spellchecker');
const FuzzyMatching = require('fuzzy-matching');
const path = require('path');
const fs = require('fs');

class FindCorrectWord {

    static #fuzzyObj;

    static async initDictonary(pinCode) {
        const dict = await SpellChecker.getDictionarySync('tokens', '.');
        FindCorrectWord.#fuzzyObj = new FuzzyMatching(dict.wordlist);
    }

    static getCorrectWord(word) {
        const fuzzyCheck = FindCorrectWord.#fuzzyObj.get(word);
        console.log(fuzzyCheck);
        if (fuzzyCheck.distance > 0.65) {
            return fuzzyCheck.value;
        }
        return word;
    }
}

module.exports = {
    FindCorrectWord
}