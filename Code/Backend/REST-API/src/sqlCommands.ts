import pool from "./mysql-pool.js";
import fsp from "node:fs/promises";

const formatexec = async (rawdata: string) => {
  const data = rawdata.split("\n").map((s) => s.trim());
  let sqlstring: string[] = [];
  const sqls: string[] = [];
  for (const sql of data) {
    if (sql) {
      sqlstring.push(sql);
    } else {
      sqls.push(sqlstring.join(" "));
      sqlstring = [];
    }
  }
  sqls.push(sqlstring.join(" "));
  //console.log(sqls);
  await Promise.all(sqls.map((s) => pool.query(s)));
};

export const startUpFunc = async () => {
  console.log("Startup SQL");

  const data = await fsp.readFile("./src/sql/createtable.sql", {
    encoding: "utf-8",
  });
  await formatexec(data);
};

export const restartFunc = async () => {
  console.log("Restart SQL");

  const data = await fsp.readFile("./src/sql/resettable.sql", {
    encoding: "utf-8",
  });
  await formatexec(data);
};

const exampleDataFunc = async () => {
  console.log("Insert SQL");
  const data = await fsp.readFile("./src/sql/demodata.sql", {
    encoding: "utf-8",
  });
  await formatexec(data);
};

export const restart = async () => {
  await restartFunc();
  await startUpFunc();
  const data = await fsp.readFile("./src/sql/test.jpg");
  await pool.query("INSERT INTO images (image, type) VALUES (?,?)", [
    data,
    "image/jpg",
  ]);
  await exampleDataFunc();
  console.log("SQL Finished");
};
