import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
import * as schema from "../db/schema";

// 加载环境变量
dotenv.config({ path: ".env.local" });

async function main() {
  // 检查 DATABASE_URL 是否存在
  console.log("DATABASE_URL from env:", process.env.DATABASE_URL ? "Loaded" : "Not found");
  
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in environment variables");
    console.error("Please check your .env.local file");
    process.exit(1);
  }

  // 创建数据库连接
  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    // 注意：Drizzle 的 push 功能需要通过 drizzle-kit 命令行工具来执行
    // 这个脚本只是建立连接和验证配置
    console.log("Database connection established successfully!");
    console.log("To push schema, run: npx drizzle-kit push");
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    await client.end();
  }
}

main();