import mysql from "mysql2/promise";

let pool;

function parseSslParam(val) {
  try {
    return JSON.parse(val);
  } catch (err) {
    return undefined;
  }
}

function getPool() {
  if (pool) return pool;
  const conn = process.env.DATABASE_URL;
  if (!conn) throw new Error("DATABASE_URL is not set");
  const url = new URL(conn);
  const user = decodeURIComponent(url.username);
  const password = decodeURIComponent(url.password);
  const host = url.hostname;
  const port = url.port ? Number(url.port) : 3306;
  const database = url.pathname ? url.pathname.replace(/^\//, "") : undefined;
  const params = Object.fromEntries(url.searchParams.entries());
  const ssl = params.ssl ? parseSslParam(params.ssl) : undefined;

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: ssl || undefined,
  });

  return pool;
}

export async function query(sql, params) {
  const p = getPool();
  const [rows] = await p.query(sql, params);
  return rows;
}

export async function execute(sql, params) {
  const p = getPool();
  const [result] = await p.execute(sql, params);
  return result;
}
