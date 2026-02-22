import type { Coin } from "../types/crypto";

const DB_NAME = "crypto-db"
const DB_VERSION = 1
const STORE_NAME = "favorites"

//hep dbye ulaşmak için kullan db objesi döner
async function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = () => {
            const db = req.result;

            if(!db.objectStoreNames.contains(STORE_NAME)){
                db.createObjectStore(STORE_NAME,{keyPath: "id"})
            }
        }

        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    })

}

async function addFavorites(coin: Coin): Promise<void>{

    const db = await openDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(coin);

    await new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    })
}

async function removeFav(id: string): Promise<void> {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);

    await new Promise((resolve, reject)=>{
       tx.oncomplete = () => resolve(true);
       tx.onerror = () => reject(tx.error);
    })
}   

async function getAllFavCoins(): Promise<Coin[]>{
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, "readonly");
 
    return new Promise((resolve) => {
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = ()=> resolve(req.result as Coin[]);
    })
}
export {getAllFavCoins, removeFav, addFavorites}