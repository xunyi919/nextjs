# Supabase 行级安全策略(RLS)问题解决方案

当您遇到 "new row violates row-level security policy for table 'posts'" 错误时，这意味着 Supabase 数据库中的行级安全策略阻止了对 "posts" 表的插入操作。

## 问题原因

Supabase 默认启用了行级安全(Row Level Security, RLS)，这是一项安全功能，用于控制哪些用户可以访问哪些行数据。如果没有正确配置策略，即使是认证用户也可能无法插入数据。

## 解决方案

### 方案一：在 Supabase 控制台中配置 RLS 策略

1. 登录到 [Supabase 控制台](https://app.supabase.com/)
2. 选择您的项目
3. 进入 "Table Editor" 页面
4. 找到 "posts" 表并点击进入
5. 点击 "RLS" 选项卡
6. 启用 RLS（如果尚未启用）
7. 添加以下策略：

#### 对于 INSERT 操作：
```sql
-- 允许认证用户插入文章
CREATE POLICY "允许用户插入自己的文章"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);
```

#### 对于 SELECT 操作：
```sql
-- 允许所有人查看公开文章，作者查看自己的所有文章
CREATE POLICY "允许查看文章"
ON posts FOR SELECT
USING (is_public = true OR auth.uid() = author_id);
```

#### 对于 UPDATE 操作：
```sql
-- 允许作者更新自己的文章
CREATE POLICY "允许用户更新自己的文章"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);
```

#### 对于 DELETE 操作：
```sql
-- 允许作者删除自己的文章
CREATE POLICY "允许用户删除自己的文章"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = author_id);
```

### 方案二：使用 Supabase SQL 编辑器直接执行

如果您更喜欢使用 SQL 命令，可以在 Supabase 的 SQL 编辑器中执行以下命令：

```sql
-- 启用 posts 表的 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 为 posts 表创建策略
CREATE POLICY "允许用户插入自己的文章"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "允许查看文章"
ON posts FOR SELECT
USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "允许用户更新自己的文章"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "允许用户删除自己的文章"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = author_id);
```

### 方案三：临时禁用 RLS（仅用于开发测试）

如果您只是在开发阶段遇到这个问题，可以临时禁用 RLS：

```sql
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
```

**警告**：不建议在生产环境中禁用 RLS，因为这会降低数据安全性。

## 代码层面的改进

我们在项目中创建了 `src/lib/supabase/helpers.ts` 辅助函数来更好地处理 Supabase 操作：

1. `insertPost` - 安全地插入文章
2. `getUserPosts` - 获取用户的文章
3. `updatePost` - 更新文章

这些函数包含了适当的错误处理和认证检查。

## 验证解决方案

配置完策略后，您可以：

1. 重新启动您的应用程序
2. 登录到您的应用程序
3. 尝试创建一篇新文章
4. 检查是否仍然出现错误

如果问题仍然存在，请检查：

1. 确保您的用户已正确认证
2. 检查 `author_id` 字段是否正确设置为用户的 UID
3. 确认策略已正确应用且没有语法错误

## 最佳实践

1. 始终为生产环境启用 RLS
2. 仔细设计策略以平衡安全性和功能性
3. 定期审查和更新安全策略
4. 在代码中妥善处理认证和授权错误