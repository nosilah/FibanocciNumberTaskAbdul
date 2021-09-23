const express = require("express");
const fs = require("fs");

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public"));

const filePath = "FibNumbers.json";

// get thie all numbers by id 

app.get("/api/numbers", function (req, res) {

    const content = fs.readFileSync(filePath, "utf8");
    const numbers = JSON.parse(content);
    res.send(numbers);
});
// Get one number by id
app.get("/api/numbers/:id", function (req, res) {

    const id = req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const numbers = JSON.parse(content);
    let number = null;

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i].id == id) {
            number = numbers[i];
            break;
        }
    }

    if (number) {
        res.send(number);
    } else {
        res.status(404).send();
    }
});


// add the new numbers Fibonacci in json file 
app.post("/api/numbers", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const number = req.body.number;

    let num = {
        numberFib: findNearestNumberFibonacci(number)
    };

    let data = fs.readFileSync(filePath, "utf8");
    let numbers = JSON.parse(data);


    const id = Math.max.apply(Math, numbers.map(function (o) {
        return o.id;
    }))

    if (id != undefined) {
        num.id = id + 1;
    } else {
        num.id = 0;
    }


    numbers.push(num);
    data = JSON.stringify(numbers);

    fs.writeFileSync("FibNumbers.json", data);
    res.send(num);
});

// delete the number fibonacci by id

app.delete("/api/numbers/:id", function (req, res) {

    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let numbersFib = JSON.parse(data);
    let index = -1;

    for (let i = 0; i < numbersFib.length; i++) {
        if ((numbersFib[i].id == id) && (numbersFib[i].id != 0)) {
            index = i;
            break;
        }
    }
    if (index > -1) {

        const numberFib = numbersFib.splice(index, 1)[0];
        data = JSON.stringify(numbersFib);
        fs.writeFileSync("FibNumbers.json", data);

        res.send(numberFib);
    } else {
        res.status(404).send();
    }
});


app.listen(3000, function () {
    console.log("server ready to start...");
});

/*
 *in this function first find the index of fibonacci numbers by this frormula
 *Fn = (((1 + 5 ** 0.5)/( 0.5))**n)/(5 ** 0.5)
 */

function findNearestNumberFibonacci(num) {

    let n = (Math.log(num) +
            Math.log(5 ** 0.5)) /
        (Math.log((1 + 5 ** 0.5) * 0.5));
    n = Math.round(n);

    function createFibonacciNumber(n) {

        return n <= 1 ? n : createFibonacciNumber(n - 1) +
            createFibonacciNumber(n - 2);
    }

    return createFibonacciNumber(n);
}
