var mysql = require('mysql');
var config = require('../config/default.js')

var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    socketPath: config.database.SOCKETPATH
});

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);

            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                })
            }
        })
    })
}

let users =
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     pass VARCHAR(100) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let tdms =
    `create table if not exists tdms(
    id INT NOT NULL AUTO_INCREMENT,
    tdmid VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(200) NOT NULL,
    uid INT NOT NULL,
    finished CHAR(1) NOT NULL DEFAULT '0',
    PRIMARY KEY ( tdmid )
);`

let createTable = function (sql) {
    return query(sql, [])
}

// 建表
createTable(users);
createTable(tdms);

// 注册用户
let insertUserData = function (value) {
    let _sql = "insert into users set name=?,pass=?,avator=?,moment=?;"
    return query(_sql, value)
}
// 删除用户
let deleteUserData = function (name) {
    let _sql = `delete from users where name="${name}";`
    return query(_sql)
}
// 查找用户
let findUserData = function (name) {
    let _sql = `select * from users where name="${name}";`
    return query(_sql)
}

//insert tdm url
let insertTdmData = function (value) {
    let _sql = "insert into tdms set tdmid=?,title=?,url=?,uid=?,finish=?;";
    return query(_sql, value);
}

//delete tdm url
let deleteTdmData = function (tdmid) {
    let _sql = `delete from tdms where tdmid='${tdmid}';`;
    return query(_sql)
}

// find tdm
let findTdmData = function (tdmid) {
    let _sql = `select * from tdms where tdmid='${tdmid}';`;
}

// update download tdm video finished
let updateTdmIsFinished = function (values) {
    let _sql = `update tdms set  finish=? where id=?`
    return query(_sql, values)
}

module.exports={
    query,
    createTable,
    insertUserData,
    deleteUserData,
    findUserData,
    insertTdmData,
    deleteTdmData,
    findTdmData,
    updateTdmIsFinished
}