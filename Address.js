const { FindCorrectWord } = require("./FindCorrectWord");
const tokens_pincodewise = require("./data.json");
const levenshtein = require("js-levenshtein");

class Address {
	#address;

	constructor(obj) {
		if (!!!obj) obj = {};

		this.#address = {
			house: obj.house || "NA",
			street: obj.street || "NA",
			area: obj.area || "NA",
			landmark: obj.landmark || "NA",
			village: obj.village || "NA",
			subdistrict: obj.subdistrict || "NA",
			district: obj.district || "NA",
			state: obj.state || "NA",
			pincode: obj.pincode || "NA",
		};
	}

	async enableSpellChecker(pinCode) {
		await FindCorrectWord.initDictonary(pinCode);
	}

	static isValidAddress(addrObj) {
		const missingImportantFields = Object.keys(addrObj).filter(
			(a) =>
				addrObj[a] === "" &&
				!(
					a === "house" ||
					a === "street" ||
					a === "landmark" ||
					a === "area"
				)
		);

		return missingImportantFields.length < 1;
	}

	static removeEndCommaAndSpecialChars(str) {
		return str.toString().trim().replace(/,\s*$/, "").replace(/[^0-9.\-\/,\sa-zA-Z]/g, "");
	}

	static removeEndCommaAndSpecialCharsFromObject(addrObj) {
		Object.keys(addrObj).forEach((field) => {
			addrObj[field] = Address.removeEndCommaAndSpecialChars(addrObj[field]);
		});
		return addrObj;
	}

	static getCorrectWords(sentence) {
		if (typeof sentence == "string") {
			let words = sentence.split(" ");

			for (let i in words) {
				words[i] = Address.removeEndCommaAndSpecialChars(FindCorrectWord.getCorrectWord(words[i]));
			}
			words = words.join(" ");
			return Address.capitalizeFirstLetter(words);
		}
		return sentence;
	}

	correctSpellingMistakes(addrObj) {
		addrObj["landmark"] = Address.getCorrectWords(addrObj["landmark"]);
		addrObj["subdistrict"] = Address.getCorrectWords(addrObj["subdistrict"]);
		addrObj["district"] = Address.getCorrectWords(addrObj["district"]);
		addrObj["state"] = Address.getCorrectWords(addrObj["state"]);

		return Address.removeEndCommaAndSpecialCharsFromObject(addrObj);
	}

	removeDuplicates(addrObj) {
		let dict = {};
		dict["district"] = addrObj.district;
		dict["subdistrict"] = addrObj.subdistrict;
		dict["village"] = addrObj.village;
		dict["area"] = addrObj.area;
		dict["landmark"] = addrObj.landmark;
		let values = Object.values(dict);
		let keys = Object.keys(dict);

		let count = 0;
		keys.forEach((key, i) => {
			values.forEach((value, i) => {
				if (i != count) {
					if (levenshtein(dict[key], value) == 0) {
						dict[keys[i]] = "NA";
					}
				}
			});
			count++;
		});
		keys.forEach((key, i) => {
			addrObj[key] = dict[key];
		});
		return addrObj;
	}

	static capitalizeFirstLetter(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	fillEmpty(addrObj) {
		console.log(108, tokens_pincodewise[addrObj.pincode]);
		console.log(109, addrObj);
		if (!!addrObj.pincode && !!tokens_pincodewise[addrObj.pincode]) {

			const respObj = tokens_pincodewise[addrObj.pincode][0];

			if (!!!addrObj.state || addrObj.state == 'NA') {
				console.log(114);
				addrObj.state = Address.capitalizeFirstLetter(respObj.state.toString().toLowerCase());
			}
			if (!!!addrObj.district || addrObj.district == 'NA') {
				addrObj.district = Address.capitalizeFirstLetter(respObj.district);
			}
			if (!!!addrObj.subdistrict || addrObj.subdistrict == 'NA') {
				addrObj.subdistrict = Address.capitalizeFirstLetter(respObj.taluka);
			}
		}
		return addrObj;
	}

	getAddrString(addrObj) {
		let arr = [];
		for (let i in addrObj) {
			if (!!addrObj[i]) arr.push(addrObj[i]);
		}
		return arr.join(', ');
	}

	getFinalAddress() {
        this.#address = Address.removeEndCommaAndSpecialCharsFromObject(this.#address);
        this.#address = this.correctSpellingMistakes(this.#address);
        this.#address = this.fillEmpty(this.#address);
        this.#address = this.removeDuplicates(this.#address);
        return this.#address;
	}

	getCurrentData() {
		return this.#address;
	}
}

module.exports = {
	Address,
};
