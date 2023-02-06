const {query} = require("./api/services/database.service");
const { db } = require("./api/configs/dev.config");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", async (req,res) =>
{    
    const result = await query("SHOW TABLES");
    res.json(result);
});

app.get('/:table', async (req, res) => 
{
    const { table } = req.params;
    const sql = `SELECT * FROM ${table} WHERE is_deleted = 0`;
    const result = await query(sql);
    res.json(result);
})

app.get('/:table/:id', async (req, res) => 
{
    const { table } = req.params;
    const id = req.params.id;
    const sql = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
    const result = await query(sql);
    res.json(result.length == 1 ? result.pop() : null);
})

app.post("/:table", async (req,res) =>
{
    const { table } = req.params;
    const { body } = req;
    for(const key in body){
        if(typeof body[key] == "string")
            body[key] = body[key].replace(/'/g, "\\'");
    }
    const keys = Object.keys(body).join(",");
    const values = "'" + Object.values(body).join("','") + "'";    
    const sqlInsert = `INSERT INTO ${table} ( ${keys} ) VALUES ( ${values} )`;    
    const insertResult = await query(sqlInsert);
    const { insertId } = insertResult;
    const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${insertId}`;
    const result = await query(sqlSelect);
    res.json(result.length == 1 ? result.pop() : null);
});

app.put("/:table/:id", async (req,res) =>
{
    const { table } = req.params;
    const { body } = req;
    const id = req.params.id; 
    for(const key in body){
        if(typeof body[key] == "string")
            body[key] = body[key].replace(/'/g, "\\'");
    }
    const updates = Object.keys(body).map(key => `${key} = '${body[key]}'`).join(", ");
    const sqlUpdate = `UPDATE ${table} SET ${updates} WHERE id = ${id}`;
    const updateResult = await query(sqlUpdate);
    res.json(updateResult);
}); 

app.patch("/:table/:id", async (req,res) =>{
    //soft delete de la category ayant l'id:id
    const id = req.params.id;
    const { table } = req.params;
    const sql = `UPDATE ${table} SET is_Deleted = 1 WHERE id = ${id}`;
    const result = await query(sql);
    const data = await query(`SELECT * FROM ${table} WHERE id = ${id}`);
    res.json({data, result: true, message: `Dans ${table} soft delete de : ${id}`});
});

app.delete("/:table/:id", async (req,res) =>{
    //soft delete de la category ayant l'id:id
    const id = req.params.id;
    const { table } = req.params;
    const sql = `DELETE ${table} WHERE id = ${id}`;    
    const result = await query(sql);
    res.json({result, result: true, message: `Dans ${table} hard delete de : ${id}`});
});



const PORT = 1337;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})