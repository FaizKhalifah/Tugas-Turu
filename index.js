import express from "express";
import { promises as fsPromises } from 'fs';
import process from "process";
import readlinePromises from "readline/promises";
import { MongoClient } from 'mongodb';

const input = readlinePromises.createInterface({
    input:process.stdin,
    output:process.stdout
})

const client = new MongoClient('mongodb://localhost:27017/Latihan1');

let mahasiswa;
let kumpulanMahasiswa;

async function fetchData(){
    await client.connect();
    console.log('Terhubung ke database');

    const db = client.db();
    mahasiswa = db.collection('mahasiswa');
    kumpulanMahasiswa = await mahasiswa.find().toArray();
    return kumpulanMahasiswa;
}

const app = express();

app.listen(3000,()=>{
    console.log("Server menyala");
})

let dataMahasiswa = await fetchData();
console.log(dataMahasiswa);
