const fs = require('fs');
const command = process.argv[2];
//change the index into a number
const index = parseInt(process.argv[3], 10)





function displayError() {
    console.error('Usage: node fs.js [read | create | update | destroy]');
    process.exit(1);
}


function readPets(index) {
    try {
        const petData = fs.readFileSync('pets.json');
        const pets = JSON.parse(petData)

        if (isNaN(index)) {
            console.log(pets);
        } else if (index >= 0 && index < pets.length) {
            console.log(pets[index]);
        } else {
            console.error('Invalid index');
            process.exit(1);
        }
        } catch (error) {
        throw error
    }
}



if (!command) {
    displayError()
} 

if (command === 'read') {
   readPets(index)
}

