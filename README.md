
## Address Formatting  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png" data-canonical-src="https://gyazo.com/eb5c5741b6a9a16c692170a41a49c858.png" width="30" height="30" />

**Team ID:**  StatusCode200 | **Team Members:** Priyank Shah , Pranjal Goyal &amp; Bhuvan Gandhi

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)
### Problem Statament
We needed to develop and API that takes address in RAW format (input), and perform formmating and optimizing the address (removing repetative, null values etc) and return the final address as a response.

### Solution Approach
- First of all we looked into serveal string matching algorithm, and decided to use the **Levenshtein distance Algorithm**.
- The algorithm calculates the minimum number of single-character edits required to change one word into the other. Strings do not have to be the same length
- After this, we solved the mispelling problem in fields by the use of **Fuzzy string matching** on fields that are standarized such as State, District.
- Now at last in order to solve the problem of null/empty values in field, we decided to use the **PostOffice API** which fetches the information based on pincode. We can get information regarding state, district and locality.
- At last used **Regex** in each fields of address to trim the extra space as well as removal of special charcter such as (@,*) etc.
- We returned the final formatted address as JSON object.

### Example :

> Input Address


> Output Address



### How to Run?
After cloning the repo, follow the below steps:
```sh
$ cd groww_chatbot 
$ pip install -r requirements.txt
$ python -m spacy download en
$ python manage.py runserver
```

### Mentions

<img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png" data-canonical-src="https://gyazo.com/eb5c5741b6a9a16c692170a41a49c858.png" width="100" height="100" />

***We would Like to thank [UIDAI](https://hackathon.uidai.gov.in/) team for organizing such an event which helps students in improving their development skills. We enjoyed making this Project.🎇***
