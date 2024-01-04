const express = require("express")
const sqlite3 = require('sqlite3').verbose();

const app = express();
const DB_PATH = "./database/myDB.db"

app.set("port", process.env.PORT || 9000)
app.use(express.json());

//Conexion a la base de datos SQLite

let db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Conexión exitosa a la base de datos SQLite');
    }
  });


// Routes ------------------------------------------------

// GET

app.get("/usuarios",(req, res) =>{
    const query = "SELECT * FROM usuarios";
    db.all(query, [], (err, rows)=>{
        if (err){
            res.status(500).json({error: err.message})
        } 
        res.status(200).json({usuarios: rows});
    });
});

// POST

app.post("/usuarios",(req, res)=>{
    const {nombre, email} = req.body
    const insertQuery = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
  
    db.run(insertQuery,[nombre, email], function(err){
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.status(201).json({ userID: this.lastID, message: 'Datos insertados correctamente'});
    });
    
});

// PUT

app.put("/usuarios/:id", (req, res) => {
    const userId = req.params.id;
    const {nombre, email} = req.body
    const updateQuery = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';

    db.run(updateQuery, [nombre, email, userId], function(err){
        if (err) {
            return res.status(500).json({error: err.message})
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    });
});

// DELETE

app.delete("/usuarios/:id", (req, res) => {
    const userId = req.params.id;
  
    const deleteQuery = 'DELETE FROM usuarios WHERE id = ?';
  
    db.run(deleteQuery, userId, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    });
  });


// Server running ----------------------------------------
app.listen(app.get("port"), () =>{
    console.log("Server running on port", app.get("port"))
})
