const express=require('express');
const { json } = require("express");
var cors=require('cors')

var app=express();

const PORT=process.env.PORT || 4000
app.use(cors({origin:true,credentials:true}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/',(req,res)=>{
    // house , street, area, landmark, village, pincode, subdistrict, district , state
    const obj=req.body.address
    
    let house=obj.house
    let street=obj.street
    let area=obj.area
    let landmark=obj.landmark
    let village=obj.village
    let pincode=obj.pincode
    let subdistrict=obj.subdistrict
    let district=obj.district
    let state=obj.state

    const finobj={
        house,
        street,
        area,
        landmark,
        village,
        pincode,
        subdistrict,
        district,
        state,
    }
    res.status(200).send(finobj).end()
})

app.listen(PORT,function(){
    console.log(`App listening on ${PORT}`);
});


//POST API
// State, District ,Division