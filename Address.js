const { FindCorrectWord } = require("./FindCorrectWord");
const tokens_pincodewise = require("./data.json");
const levenshtein = require("js-levenshtein");

class Address {
	#address;

	constructor(obj) {
		if (!!!obj) obj = {};

		this.#address = {
			house: obj.house || "",
			street: obj.street || "",
			area: obj.area || "",
			landmark: obj.landmark || "",
			village: obj.village || "",
			subdistrict: obj.subdistrict || "",
			district: obj.district || "",
			state: obj.state || "",
			pincode: obj.pincode || "",
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
				.replace(/[^0-9.,\sa-zA-Z]/g, "");
		});
		return addrObj;
	}

	static getCorrectWords(sentence) {
		console.log(typeof sentence);
		if (typeof sentence == "string") {
			let words = sentence.split(" ");

			for (let i in words) {
				words[i] = FindCorrectWord.getCorrectWord(words[i]);
			}
			words = words.join(" ");
			return words.charAt(0).toUpperCase() + words.slice(1);
		}
		console.log(sentence);
		return sentence;
	}

	correctSpellingMistakes(addrObj) {
		// addrObj['house'] = this.getCorrectWords(addrObj['house']);
		// addrObj['street'] = this.getCorrectWords(addrObj['street']);
		// addrObj['area'] = this.getCorrectWords(addrObj['area']);
		// addrObj['landmark'] = this.getCorrectWords(addrObj['landmark']);

		addrObj["landmark"] = Address.getCorrectWords(addrObj["landmark"]);
		addrObj["subdistrict"] = Address.getCorrectWords(
			addrObj["subdistrict"]
		);
		addrObj["district"] = Address.getCorrectWords(addrObj["district"]);
		addrObj["state"] = Address.getCorrectWords(addrObj["state"]);

		return addrObj;
	}

	removeDuplicates(addrObj) {
		let dict = {};
		dict["district"] = addrObj.district;
		dict["subdistrict"] = addrObj.subdistrict;
		dict["area"] = addrObj.area;
		dict["landmark"] = addrObj.landmark;
		dict["village"] = addrObj.village;
		let values = Object.values(dict);
		let keys = Object.keys(dict);

		let count = 0;
		keys.forEach((key, i) => {
			values.forEach((value, i) => {
				if (i != count) {
					if (levenshtein(dict[key], value) <= 1) {
						console.log(value + " mathced with " + dict[key]);
						dict[keys[i]] = "";
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

	fillEmpty(addrObj) {
		if (addrObj.pincode != "") {
			const respobj = tokens_pincodewise[addrObj.pincode][0];
            
			if (addrObj.state == "" || addrObj.state == null) {
				console.log("State empty", respobj.state);
				addrObj.state = respobj.state;
			}
			if (addrObj.district == "" || addrObj.district == null) {
				console.log("District empty", respobj.district);
				addrObj.district = respobj.district;
			}
			if (addrObj.subdistrict == "" || addrObj.subdistrict == null) {
				console.log("Subdistrict empty", respobj.taluka);
				addrObj.subdistrict = respobj.taluka;
			}
		}
		return addrObj;
	}

	getFinalAddress() {
        // console.log(134, Address.isValidAddress(this.#address));
		// if (Address.isValidAddress(this.#address)) {
        this.#address = Address.removeEndCommaAndSpecialChars(
            this.#address
        );
        this.#address = this.correctSpellingMistakes(this.#address);
        this.#address = this.fillEmpty(this.#address);
        this.#address = this.removeDuplicates(this.#address);
        return this.#address;
		// } else {
		// 	throw Error("Invalid incoming address object.");
		// }
	}

	getCurrentData() {
		return this.#address;
	}
}

module.exports = {
	Address,
};
