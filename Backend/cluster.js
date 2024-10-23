// import express from "express";
import express from "express";
import cluster from "node:cluster";
import os from "os";
const totalCPUS = os.cpus().length;
console.log(totalCPUS);

if(cluster.isPrimary){
    for(let i=0;i<totalCPUS;i++){
        cluster.fork();
    }
}else{
    const app = express();
    const PORT = 8080;
    app.get("/",(req,rs)=>{console.log(`server from ${process.pid}`)});
    app.listen(PORT,()=>console.log("server running..."));
}