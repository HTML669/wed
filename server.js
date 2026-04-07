const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./shop.db');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // ບອກໃຫ້ Server ຮູ້ວ່າໄຟລ໌ໜ້າເວັບຢູ່ໂຟນເດີ public

// ສ້າງຕາຕະລາງຖານຂໍ້ມູນ ແລະ ເພີ່ມຂໍ້ມູນເລີ່ມຕົ້ນ
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price TEXT,
        image TEXT,
        description TEXT,
        category TEXT
    )`);

    // ກວດເບິ່ງວ່າທ້າວມີຂໍ້ມູນຫຼືຍັງ ຖ້າບໍ່ມີໃຫ້ເພີ່ມ
    db.get("SELECT count(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO products (name, price, image, description, category) VALUES (?, ?, ?, ?, ?)");
            stmt.run("Caffè Americano", "25,000", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500", "ກາເຟອາເມຣິກາໂນ່ເຂັ້ມຂຸ້ນ ອາຣາບິກ້າ 100%", "Drink");
            stmt.run("Psychology Book", "120,000", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500", "ໜັງສືພັດທະນາຕົນເອງ ແລະ ຄວາມຄິດ", "Book");
            stmt.run("Luxury Villa", "450,000", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500", "ໂມເດວບ້ານວິນລ່າ ອອກແບບທັນສະໄໝ", "Model");
            stmt.finalize();
        }
    });
});

// API ດຶງສິນຄ້າທັງໝົດ
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        res.json(rows);
    });
});

// API ດຶງສິນຄ້າຕາມ ID
app.get('/api/products/:id', (req, res) => {
    db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
        res.json(row);
    });
});

app.listen(3000, () => console.log('🚀 Server ຣັນຢູ່ທີ່ http://localhost:3000'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});