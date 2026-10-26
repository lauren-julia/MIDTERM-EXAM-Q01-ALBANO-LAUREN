const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data.json");

let nextId = 6;

function readData() {
    return JSON.parse(
        fs.readFileSync(DATA_FILE, "utf8")
    );
}

function saveData(data) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2)
    );
}

app.get("/api/pets", (req, res) => {
    const pets = readData();
    res.json(pets);
});

app.get("/api/pets/:id", (req, res) => {
    const pets = readData();
    const id = Number(req.params.id);

    const pet = pets.find(pet=>
        pet.id === id
    );

    res.json(pet);
});

app.post("/api/pets", (req, res) => {
    const pets = readData();

    const { name, species, breed, age } = req.body;

    if (!name || !species || !breed || !age) {
        return res.status(400).json({
            message: "Missing required fields."
        });
    }

    const newPet = {
        id: nextId++,
        name: name.trim(),
        species: species.trim(),
        breed: breed.trim(),
        age: Number(age),
        adopted: "false"
    };

    pets.push(newPet);
    saveData(pets);

    res.status(201).json({
        message: "Pet added successfully",
        pet: newPet
    });

});

app.delete("/api/pets/:id", (req, res) => {
    const pets = readData();
    const id = Number(req.params.id);

    const updated = pets.filter(pet => 
        pet.id !== id
    );

    if (updated.length === pets.length) {
        return res.status(404).json({
            message: "Pet not found"
        });
    }

    saveData(updated);

    res.json({
        message: "Pet deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});