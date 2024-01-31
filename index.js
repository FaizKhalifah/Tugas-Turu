import process from "process";
import readlinePromises from "readline/promises";
import { MongoClient } from 'mongodb';

const input = readlinePromises.createInterface({
    input:process.stdin,
    output:process.stdout
})

async function main(){
    console.log("Selamat datang di aplikasi Tugas-Turu");
    console.log("========================================")
    let username = await input.question("Silahkan masukkan usernamemu : ");
    let password = await input.question("Masukkan password akunmu : ");
    let hasilLogin = await login(username,password);
    if(hasilLogin===false){
        console.log("Kamu masih belum memiliki akun");
        let jawaban = await input.question("Apakah kamu ingin membuat akun baru (ya/tidak)? ");
        if(jawaban.toLocaleLowerCase=="iya"){
            let usernameBaru = await input.question("Masukkan username yang ingin kamu gunakan : ");
            let passwordBaru = await input.question("Masukkan password yang ingin kamu gunakan : ");
        }else{
            console.log("Keluar dari program");
            process.exit(1);
        }
    }else{
        console.log(`Selamat datang ${username}, silahkan menggunakan aplikasi ini`);
    }
}

const client = new MongoClient('mongodb://localhost:27017/TugasTuru');




async function fetchData(){
    await client.connect();
    const db = client.db();
    let mahasiswa = db.collection('User');
    return mahasiswa;
}


async function showData(){
    const dataMahasiswa = await fetchData();
    const listMahasiswa = await dataMahasiswa.find().toArray();
    return listMahasiswa;
}

async function login(username,password){
    const dataMahasiswa = await fetchData();
    const tampungan = await dataMahasiswa.findOne({nama:username,password:password});
    if(tampungan==null){
        return false;
    }else{
        return true;
    }
}


main();