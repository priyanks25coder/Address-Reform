const express = require("express");
const cors = require("cors");
const { Address } = require("./Address");

const app = express();

const PORT = process.env.PORT || 4000;
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/", async (req, res) => {
	// house, street, area, landmark, village, pincode, subdistrict, district, state

    let obj = req.body;

	try {
		const addressObject = new Address(obj);
		await addressObject.enableSpellChecker(
			addressObject.getCurrentData().pincode
		);
		const finalObj = addressObject.getFinalAddress();
		res.status(200).send(finalObj).end();
	} catch (e) {
		console.log(e);
		res.status(204)
			.send({ message: "Invalid incoming address object." })
			.end();
	}
});

app.listen(PORT, () => {
	console.log(`App listening on ${PORT}`);
});
