// Import MySQL connection.

const connection = require("../config/connection.js");

// Helper functions for SQL syntax.

function printQuestionMarks(num) {
    let arr = [];

    for (let i = 0; i < num; i++) {
        arr.push("?");
    }

    return arr.toString();
}

function objToSql(obj) {
    let arr = [];

    for (let key in obj) {
        let value = obj[key];

        if (Object.hasOwnProperty.call(obj, key)) {

            if (typeof value === "string" && value.indexOf(" ") >= 0) {
                value = `'${value}'`;
            }

            arr.push(`${key}=${value}`);
        }
    }

    return arr.toString();
}

// Object for all our SQL statement functions.

const orm = {
    all: (tableInput, cb) => {
        const queryString = `
        SELECT * FROM ${tableInput};
        `;
        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            }
            cb(result);
        });
    },

    create: (table, cols, vals, cb) => {
        const queryString = `
        INSERT INTO ${table} (${cols.toString()})
        VALUES (${printQuestionMarks(vals.length)})
        `;

        console.log(queryString);

        connection.query(queryString, vals, (err, result) => {
            if (err) {
                throw err;
            }

            cb(result);
        });
    },

    update: (table, objColVals, condition, cb) => {
        const queryString = `
        UPDATE ${table}
        SET ${objToSql(objColVals)}
        WHERE ${objToSql(condition)}
        `;

        console.log(queryString);

        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            }

            cb(result);
        });
    },

    delete: (table, condition, cb) => {
        const queryString = `
        DELETE FROM ${table} 
        WHERE ${objToSql(condition)}
        `;

        console.log(queryString);

        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            }

            cb(result);
        });
    }
};

// Export the orm object so our models can use it!
module.exports = orm;