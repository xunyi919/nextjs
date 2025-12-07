-- 添加 category 字段到 posts 表
-- 如果字段已存在，此命令会失败，可以忽略

-- 检查字段是否存在，如果不存在则添加
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'posts' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE posts ADD COLUMN category VARCHAR(255);
    END IF;
END $$;

-- 为现有文章设置默认分类（可选）
-- UPDATE posts SET category = '未分类' WHERE category IS NULL;

