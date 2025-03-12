import mongoose from "mongoose"

export const conectaDB=async(url, dbName)=>{
    try {
        await mongoose.connect(
            url,
            {
                dbName: dbName
            }
        )
        console.log(`DB online!`)
    } catch (error) {
        console.log(`Error al conectar a db: ${error.message}`)
    }
}