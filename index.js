import express from "express";
import { promises as fsPromises } from 'fs';
import process from "process";
import readlinePromises from "readline/promises";

const input = readlinePromises.createInterface({
    input:process.stdin,
    output:process.stdout
})

let testing = await input.question("Testing : ");
console.log(testing);