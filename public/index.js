// Get the all Fibonnaci numbers from  file Fibonacci.json this file I set it as DB
async function GetNumbersFib() {

    const response = await fetch("/api/numbers", {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (response.ok === true) {
        const numbers = await response.json();
        let rows = document.querySelector("tbody");

        numbers.forEach(number => {
            rows.append(row(number));
        });
    }
}

//Get one Fibbonacci number
async function GetNumberFib(id) {
    const response = await fetch("/api/numbers/" + id, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (response.ok === true) {
        const number = await response.json();
        const form = document.forms["numberFibForm"];
        form.elements["id"].value = number.id;
        form.elements["number"].value = number.name;
    }
}


//  add new number
async function CreateNumberFib(numberFib) {

    const response = await fetch("api/numbers", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            number: parseInt(numberFib, 10)
        })
    });

    if (response.ok === true) {
        const numberFib = await response.json();
        document.querySelector("tbody").append(row(numberFib));
    }
}


async function DeleteNumber(id) {
    const response = await fetch("/api/numbers/" + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    });
    if ((response.ok === true) && (id != 0)) {
        const numberFib = await response.json();
        document.querySelector("tr[data-rowid='" + numberFib.id + "']")
            .remove();
    }
    console.log(id);
}

// creat row in table
function row(numberFib) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", numberFib.id);

    const idTd = document.createElement("td");
    idTd.append(numberFib.id);
    tr.append(idTd);

    const numberFibTd = document.createElement("td");
    numberFibTd.append(numberFib.numberFib);
    tr.append(numberFibTd);

    const linksTd = document.createElement("td");

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", numberFib.id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Delete");
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        DeleteNumber(numberFib.id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}



// send form
document.forms["numberFibForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["numberFibForm"];
    const number = form.elements["number"];
    const error = document.getElementById('error')
    if (!isNaN(number.value) && isFinite(number.value) && (number.value != '' && (number.value > 0))) {
        CreateNumberFib(number.value);
    } else if (number.value == '') {
        number.classList.add('invalid');
        error.innerHTML = 'Please enter any number  and try again'
    } else if (number.value <= 0) {
        number.classList.add('invalid');
        error.innerHTML = 'Please enter any number > 0 and try again'
    } else {
        number.classList.add('invalid');
        error.innerHTML = `${number.value} is  not a number, please enter the number and try again`
    }

    number.value = '';

    number.onfocus = function () {
        if (this.classList.contains('invalid')) {
            this.classList.remove('invalid');
            error.innerHTML = "";

        }
    }
});

// load Fibonacci numbers to DOM

GetNumbersFib();

