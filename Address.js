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

	static removeEndCommaAndSpecialChars(addrObj) {
		Object.keys(addrObj).forEach((field) => {
			addrObj[field] = addrObj[field]
				.toString()
				.trim()
				.replace(/,\s*$/, "")
				.replace(/[^0-9.\-,\sa-zA-Z]/g, "");
		});
		return addrObj;
	}

	static getCorrectWords(sentence) {
		if (typeof sentence == "string") {
			let words = sentence.split(" ");

			for (let i in words) {
				words[i] = FindCorrectWord.getCorrectWord(words[i]);
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

		return addrObj;
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
		if (addrObj.pincode != "") {
			const respobj = tokens_pincodewise[addrObj.pincode][0];
			if (!!!addrObj.state) {
				addrObj.state = Address.capitalizeFirstLetter(respobj.state.toString().toLowerCase());
			}
			if (!!!addrObj.district) {
				addrObj.district = Address.capitalizeFirstLetter(respobj.district);
			}
			if (!!!addrObj.subdistrict) {
				addrObj.subdistrict = Address.capitalizeFirstLetter(respobj.taluka);
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
        this.#address = Address.removeEndCommaAndSpecialChars(this.#address);
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
