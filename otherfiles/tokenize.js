const fs = require('fs');
const path = require('path');

module.exports = {
    removeUnwantedData: (word) => {
        return word.toString().trim().replace('S.O', '').replace('B.O', '').replace('H.O', '').replace('G.P.O.', '').replace('.', '').replace('(T)', '').replace('HQ', '').replace('  ', '').replace("\"", '').replace("'", '').replace('(', '|').replace(')', '').trim().toLowerCase().replace(/[^\sa-z]/g, '').split('|');
    },
    getTokens: async (all_data) => {
        let tokens = {};

        // for (let pinCode in all_data) {
        //     for (let areaIndex in all_data[pinCode]) {
        //         for (let attrName in all_data[pinCode][areaIndex]) {
        //             let word = module.exports.removeUnwantedData(all_data[pinCode][areaIndex][attrName]);
        //             for (let k in word) {
        //                 if (!!!tokens[word[k]] && word[k] !== 'na') {
        //                     tokens[word[k]] = {};
        //                 }
        //             }
        //         }
        //     }
        // }

        for (let i in all_data) {
            for (let j in all_data[i]) {
                if (!!!tokens[all_data[i][j]] && tokens[all_data[i][j]] !== 'na') {
                    tokens[all_data[i][j]] = {};
                }
            }
        }

        

        const json_path = path.join(__dirname, 'regiontokens.dic');
        fs.writeFileSync(json_path, Object.keys(tokens).join('\n'), 'utf-8', (err) => {
            console.log(err);
        });
        
        // TOKENIZE ALL ENTRIES
        // for (let pinCode in all_data) {
        //     for (let areaIndex in all_data[pinCode]) {
        //         for (let attrName in all_data[pinCode][areaIndex]) {
        //             let word = module.exports.removeUnwantedData(all_data[pinCode][areaIndex][attrName]);
        //             for (let k in word) {
        //                 if (!!!tokens[word[k]] && word[k] !== 'na') {
        //                     tokens[word[k]] = {};
        //                     // tokens[pinCode][word[k]] = {};
        //                     // token_list[pinCode].push(word[k]);
        //                 }
        //             }
        //         }
        //     }
        // }
        // const json_path = path.join(__dirname, 'tokens.json');
        // fs.writeFileSync(json_path, JSON.stringify({ list: Object.keys(tokens) }), 'utf-8', (err) => {
        //     console.log(err);
        // });


        // TOKENIZE PINCODE WISE
        // for (let pinCode in all_data) {
        //     token_list[pinCode] = [];
        //     tokens[pinCode] = {};
        //     for (let areaIndex in all_data[pinCode]) {
        //         for (let attrName in all_data[pinCode][areaIndex]) {
        //             let word = module.exports.removeUnwantedData(all_data[pinCode][areaIndex][attrName]);
        //             for (let k in word) {
        //                 if (!!!tokens[pinCode][word[k]] && word[k] !== 'na') {
        //                     tokens[pinCode][word[k]] = {};
        //                     token_list[pinCode].push(word[k]);
        //                 }
        //             }
        //         }
        //     }
        // }
        // const json_path = path.join(__dirname, 'tokens.json');
        // fs.writeFileSync(json_path, JSON.stringify(token_list), 'utf-8', (err) => {
        //     console.log(err);
        // });
    },
    tokenizeJson: async () => {
        // const filePath = path.join(__dirname, './data.json');
        const filePath = path.join(__dirname, './regiondata.json');
        const fileObj = fs.readFileSync(filePath, {encoding: 'utf-8'}, (err) => {
            console.log(err);
            reject(err);
        });

        return await module.exports.getTokens(JSON.parse(fileObj)).then(() => {
            return "Done";
        });
    },
}