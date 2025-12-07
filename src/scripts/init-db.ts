import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

async function main() {
  // 创建数据库连接
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(client);

  try {
    // 运行迁移
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    await client.end();
  }
}

main();