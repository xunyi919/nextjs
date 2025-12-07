import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config({ path: ".env.local" });

async function addCategoryField() {
  if (!process.env.DATABASE_URL) {
    console.error("错误: 未找到 DATABASE_URL 环境变量");
    console.error("请在 .env.local 文件中设置 DATABASE_URL");
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);
  
  try {
    console.log("正在检查 posts 表中的 category 字段...");
    
    // 检查字段是否存在
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'posts' 
      AND column_name = 'category';
    `;
    
    const result = await client.unsafe(checkQuery);
    
    if (result.length > 0) {
      console.log("✓ category 字段已存在，无需添加");
    } else {
      console.log("正在添加 category 字段到 posts 表...");
      
      // 添加 category 字段
      await client.unsafe(`
        ALTER TABLE posts 
        ADD COLUMN category VARCHAR(255);
      `);
      
      console.log("✓ category 字段添加成功！");
    }
    
    console.log("完成！");
  } catch (error) {
    console.error("添加 category 字段时出错:", error);
    throw error;
  } finally {
    await client.end();
  }
}

addCategoryField()
  .then(() => {
    console.log("脚本执行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("脚本执行失败:", error);
    process.exit(1);
  });

