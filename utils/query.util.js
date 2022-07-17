const db = require("../configs/database");

async function findById(id, tableName, columnName) {
  const sql = `select * from ${tableName} where ${columnName} = ${id}`;
  const user = await db.query(sql);
  return user.rows;
}

async function findAll(tableName, columnName = '*') {
  const sql = `select ${columnName} from ${tableName}`;
  const user = await db.query(sql);
  return user.rows;
}

async function insert(tableName, columnValues, values) {
  const sql = {
    text: `INSERT INTO ${tableName} ${columnValues}`,
    values: values,
  };
  return await db.query(sql);
}

module.exports = {
  findById,
  findAll,
  insert,
};
