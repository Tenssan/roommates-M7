const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { getRandomUser } = require("./utils/randomUser");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const roommatesFilePath = path.join(__dirname, "roommates.json");
const expensesFilePath = path.join(__dirname, "expenses.json");

const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file from disk:", error);
    return { expenses: [], roommates: [] };
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file to disk:", error);
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.post("/roommate", async (req, res) => {
  try {
    const newRoommate = await getRandomUser();
    const roommatesData = readJSONFile(roommatesFilePath);
    roommatesData.roommates.push(newRoommate);
    writeJSONFile(roommatesFilePath, roommatesData);
    res.status(201).json(newRoommate);
  } catch (error) {
    console.error("Error adding new roommate:", error);
    res
      .status(500)
      .json({ error: "Error adding new roommate", message: error.message });
  }
});

app.get("/roommates", (req, res) => {
  const roommates = readJSONFile(roommatesFilePath);
  res.status(200).json(roommates);
});

app.get("/gastos", (req, res) => {
  const expenses = readJSONFile(expensesFilePath);
  res.status(200).json({ gastos: expenses.expenses });
});

app.post("/gasto", (req, res) => {
  try {
    const { roommate, descripcion, monto } = req.body;
    const newExpense = {
      id: uuidv4().slice(0, 8),
      roommate,
      descripcion: descripcion.trim(),
      monto,
    };

    if (!/[a-zA-Z]/.test(newExpense.descripcion)) {
      return res
        .status(400)
        .json({ error: "Description must include at least one letter." });
    }

    const expensesData = readJSONFile(expensesFilePath);
    expensesData.expenses.push(newExpense);

    const roommatesData = readJSONFile(roommatesFilePath);
    const roommateIndex = roommatesData.roommates.findIndex(
      (r) => r.nombre === roommate
    );

    if (roommateIndex !== -1) {
      roommatesData.roommates[roommateIndex].debe += monto;
    }

    writeJSONFile(expensesFilePath, expensesData);
    writeJSONFile(roommatesFilePath, roommatesData);

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res
      .status(500)
      .json({ error: "Error adding expense", message: error.message });
  }
});

app.put("/gasto", (req, res) => {
  try {
    const { id } = req.query;
    const { roommate, descripcion, monto } = req.body;

    const expensesData = readJSONFile(expensesFilePath);
    const index = expensesData.expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const oldExpense = expensesData.expenses[index];
    expensesData.expenses[index] = {
      id,
      roommate,
      descripcion: descripcion.trim(),
      monto,
    };

    if (!/[a-zA-Z]/.test(expensesData.expenses[index].descripcion)) {
      return res
        .status(400)
        .json({ error: "Description must include at least one letter." });
    }

    const roommatesData = readJSONFile(roommatesFilePath);
    const oldRoommateIndex = roommatesData.roommates.findIndex(
      (r) => r.nombre === oldExpense.roommate
    );
    const newRoommateIndex = roommatesData.roommates.findIndex(
      (r) => r.nombre === roommate
    );

    if (oldRoommateIndex !== -1) {
      roommatesData.roommates[oldRoommateIndex].debe -= oldExpense.monto;
    }
    if (newRoommateIndex !== -1) {
      roommatesData.roommates[newRoommateIndex].debe += monto;
    }

    writeJSONFile(expensesFilePath, expensesData);
    writeJSONFile(roommatesFilePath, roommatesData);

    res.status(200).json(expensesData.expenses[index]);
  } catch (error) {
    console.error("Error updating expense:", error);
    res
      .status(500)
      .json({ error: "Error updating expense", message: error.message });
  }
});

app.delete("/gasto", (req, res) => {
  try {
    const { id } = req.query;

    const expensesData = readJSONFile(expensesFilePath);
    const index = expensesData.expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const [deletedExpense] = expensesData.expenses.splice(index, 1);

    const roommatesData = readJSONFile(roommatesFilePath);
    const roommateIndex = roommatesData.roommates.findIndex(
      (r) => r.nombre === deletedExpense.roommate
    );

    if (roommateIndex !== -1) {
      roommatesData.roommates[roommateIndex].debe -= deletedExpense.monto;
      roommatesData.roommates[roommateIndex].recibe += deletedExpense.monto;
    }

    writeJSONFile(expensesFilePath, expensesData);
    writeJSONFile(roommatesFilePath, roommatesData);

    res.status(200).json(deletedExpense);
  } catch (error) {
    console.error("Error deleting expense:", error);
    res
      .status(500)
      .json({ error: "Error deleting expense", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
