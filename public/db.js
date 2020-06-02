import { response } from "express";

let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.online) {
        checkDatabase();
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

export function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.createObjectStore("pending");

    store.add(record)
}


export function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");

    const getAll = store.getAll();

    getAll.onsuccess= function() {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "applicatio/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(responst => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");

                const store = transaction.objectStore("pending");

                store.clear();
            })
        }
    }
}

window.addEventListener("online", checkDatabase);