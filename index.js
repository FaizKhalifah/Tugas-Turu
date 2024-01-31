import express from "express";
import { promises as fsPromises } from 'fs';
import process from "process";
import readlinePromises from "readline/promises";

const input = readlinePromises.createInterface({
    input:process.stdin,
    output:process.stdout
})

const app = express();
app.listen(3000,()=>{
    console.log("Server menyala");
});

app.get('/mahasiswa',(req,res)=>{
    res.json({
        pesan:"Selamat datang di API"
    })
})

