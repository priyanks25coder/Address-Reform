const fs = require('fs');
const path = require('path');

module.exports = {
    convertCsvToJson: async () => {
        const filePath = path.join(__dirname, './addresses.csv');
        const fileObj = fs.readFileSync(filePath, {encoding: 'utf-8'}, (err) => {
            console.log(err);
            reject(err);
        });

        const rows = fileObj.split('\n');
        
        let json_obj = {};

        rows.forEach(row => {
            row = row.split(',');
            if (!!!json_obj[row[1]]) json_obj[row[1]] = [];
            json_obj[row[1]].push({
                office: row[0],
                division: row[4],
                region: row[5],
                circle: row[6],
                taluka: row[7],
                district: row[8],
                state: row[9],
                suboffice: row[11],
                headoffice: row[12],
            });
        });

        const json_path = path.join(__dirname, 'data.json');
        fs.writeFileSync(json_path, JSON.stringify(json_obj), 'utf-8', (err) => {
            console.log(err);
        });

        return "Done";
    },
    getStateDistrict: async () => {
        const filePath = path.join(__dirname, './stateDistricts.csv');
        const fileObj = fs.readFileSync(filePath, {encoding: 'utf-8'}, (err) => {
            console.log(err);
            reject(err);
        });

        const rows = fileObj.split('\r');
        
        let json_obj = [];

        const removeUnwantedData = (value) => {
            if (!!!value) value = '';
            return value.toString().toLowerCase().replace(/[^\sa-z]/g, '').trim();
        }

        rows.forEach(row => {
            row = row.split(',');

            json_obj.push({
                subdistrict: removeUnwantedData(row[1]),
                district: removeUnwantedData(row[6]),
                state: removeUnwantedData(row[4]),
            });
        });

        const json_path = path.join(__dirname, 'regiondata.json');
        fs.writeFileSync(json_path, JSON.stringify(json_obj), 'utf-8', (err) => {
            console.log(err);
        });

        return "Done";
    }
}