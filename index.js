import process from "process";
import readlinePromises from "readline/promises";
import { MongoClient } from 'mongodb';

const input = readlinePromises.createInterface({
    input:process.stdin,
    output:process.stdout
})

async function main(){
    let looping = true;
    while(looping){
        console.log("Selamat datang di aplikasi Tugas-Turu");
        console.log("========================================")
        let username = await input.question("Silahkan masukkan usernamemu : ");
        let password = await input.question("Masukkan password akunmu : ");
        let hasilLogin = await login(username,password);
        if(hasilLogin===false){
            console.log("Kamu masih belum memiliki akun");
            let jawaban = await input.question("Apakah kamu ingin membuat akun baru (ya/tidak)? ");
            if(jawaban.toLowerCase()=="ya"){
                let usernameBaru = await input.question("Masukkan username yang ingin kamu gunakan : ");
                let passwordBaru = await input.question("Masukkan password yang ingin kamu gunakan : ");
                let status = await addUser(usernameBaru,passwordBaru);
                console.log(status);
            }else{
                console.log("Keluar dari program");
                process.exit(1);
            }
        }else{
            console.log(`Selamat datang ${username}, silahkan menggunakan aplikasi ini`);
            while(true){
                const opsi = ["Tambah Tugas", "Hapus Tugas","List Tugas","Keluar Dari Program"];
                let statusCheck = await check(username,password);
                if(statusCheck==false){
                    console.log("Anda bisa turu sekarang karena tidak ada tugas :)");
                }
                for (let i in opsi){
                    console.log(`${Number(i)+1} ${opsi[i]}`);
                }
                let perintah = await input.question("Masukkan perintah yang kamu inginkan (dalam bentuk angka) : ");
                if(Number(perintah)==1){
                    let namaTugas = await input.question("Masukkan nama tugas : ");
                    let matkul = await input.question("Masukkan mata kuliah dari tugas : ");
                    let statusTambah = await addTask(username,password,namaTugas,matkul);
                    console.log(statusTambah);
                }else if(Number(perintah)==4){
                    console.log("Keluar dari layanan");
                    break;
                }
            }

        }
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

async function addUser(username,password){
    const dataMahasiswa = await fetchData();
    await dataMahasiswa.insertOne({
        "nama" : username,
        "password" : password,
        "tugas":[],
        "poin":0
    })
    return "Selamat, akun anda telah ditambahkan";
}


async function addTask(username,password,namaTugas,matkul){
    const dataMahasiswa = await fetchData();
    const tugasBaru = {
        "namaTugas":namaTugas,
        "matkul":matkul
    }
    await dataMahasiswa.updateOne({nama:username,password:password},{$push:{tugas:tugasBaru}});
    return "tugas berhasil ditambah";
}

async function check(username,password){
    const dataMahasiswa = await fetchData();
    const tampungan = await dataMahasiswa.findOne({nama:username,password:password},{tugas:1});
    const arrayTugas = tampungan.tugas;
    if(arrayTugas.length==0){
        return false;
    }else{
        return true;
    }
}

main();
