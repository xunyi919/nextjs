import { getSupabaseClient } from "@/lib/supabase/client";

/**
 * 插入文章到 posts 表
 * 处理行级安全策略问题
 */
export async function insertPost(
  title: string, 
  content: string, 
  tag: string, 
  userId: string,
  category: string,
  slug?: string,
  published: boolean = false,
  isPublic: boolean = false
) {
  const supabase = getSupabaseClient();
  
  // 确保用户已认证
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("用户未认证");
  }
  
  // 生成 slug（如果没有提供）
  const finalSlug = slug || `${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`;
  
  try {
    // 构建插入数据对象
    const insertData: {
      title: string;
      content: string;
      tag: string;
      author_id: string;
      slug: string;
      published: boolean;
      is_public: boolean;
      created_at: string;
      updated_at: string;
      category?: string;
    } = {
      title,
      content,
      tag,
      author_id: userId, // 使用正确的列名
      slug: finalSlug,
      published,
      is_public: isPublic,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: category,
    };
    
    // 处理分类（支持逗号分隔）
    let categoryArray: string[] = [];
    if (category && category.trim()) {
      categoryArray = category.split(',').map(c => c.trim()).filter(c => c);
      insertData.category = categoryArray.join(',');
      
      // 将分类保存到 categories 表中（如果不存在则插入，存在则增加计数）
      if (categoryArray.length > 0) {
        await handleCategories(categoryArray);
      }
    }
    
    // 处理标签（如果存在）
    // if (tag && tag.trim()) {
    //   const tags = tag.split(',').map(t => t.trim()).filter(t => t);
    //   // 将分类和标签合并存储到tag字段中
    //   if (categoryArray && categoryArray.length > 0) {
    //     insertData.tag = [...categoryArray, ...tags].join(',');
    //   } else {
    //     insertData.tag = tags.join(',');
    //   }
      
    //   // 标签不需要单独处理，因为它们已经在tag字段中了
    // }
    
    // 尝试插入文章
    const { data, error } = await supabase
      .from("posts")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("插入文章时出错:", error);
      
      // 如果错误是因为 category 字段不存在，提供友好的错误信息
      if (error.message && error.message.includes("category")) {
        throw new Error("数据库表中缺少 category 字段。请运行 'npm run db:add-category' 来添加该字段。");
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    console.error("插入文章失败:", error);
    throw error;
  }
}

/**
 * 获取用户的文章
 */
export async function getUserPosts(userId: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", userId) // 使用正确的列名
    .order("created_at", { ascending: false });

  if (error) {
    console.error("获取用户文章时出错:", error);
    throw error;
  }

  return data;
}

/**
 * 更新文章
 */
export async function updatePost(postId: number, updates: Partial<{
  title: string;
  content: string;
  tag: string;
  slug: string;
  published: boolean;
  is_public: boolean;
}>) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    console.error("更新文章时出错:", error);
    throw error;
  }

  return data;
}

/**
 * 处理标签
 * 检查标签是否存在，如果存在则增加计数，否则创建新标签
 */
export async function handleTags(tags: string[]) {
  const supabase = getSupabaseClient();
  
  for (const tagName of tags) {
    const trimmedTag = tagName.trim();
    if (!trimmedTag) continue;
    
    // 检查标签是否已存在
    const { data: existingTags, error: selectError } = await supabase
      .from('tags')
      .select('id, num')
      .eq('name', trimmedTag);

    if (selectError) {
      console.error(`查询标签 "${trimmedTag}" 时出错:`, selectError);
      continue;
    }

    // 检查是否有匹配的标签
    if (existingTags && existingTags.length > 0) {
      // 标签存在，更新数量+1
      const existingTag = existingTags[0]; // 取第一个匹配的标签
      const { error: updateError } = await supabase
        .from('tags')
        .update({ num: existingTag.num + 1 })
        .eq('id', existingTag.id);

      if (updateError) {
        console.error(`更新标签 "${trimmedTag}" 时出错:`, updateError);
      }
    } else {
      // 标签不存在，插入新标签
      const { error: insertError } = await supabase
        .from('tags')
        .insert([{ name: trimmedTag, num: 1 }]);

      if (insertError) {
        console.error(`插入标签 "${trimmedTag}" 时出错:`, insertError);
      }
    }
  }
}

/**
 * 处理分类
 * 检查分类是否存在，如果存在则增加计数，否则创建新分类（保存到 categories 表）
 */
export async function handleCategories(categories: string[]) {
  const supabase = getSupabaseClient();
  
  for (const categoryName of categories) {
    const trimmedCategory = categoryName.trim();
    if (!trimmedCategory) continue;
    
    // 检查分类是否已存在（在 categories 表中）
    const { data: existingCategories, error: selectError } = await supabase
      .from('categories')
      .select('id, num')
      .eq('name', trimmedCategory);

    if (selectError) {
      console.error(`查询分类 "${trimmedCategory}" 时出错:`, selectError);
      continue;
    }

    // 检查是否有匹配的分类
    if (existingCategories && existingCategories.length > 0) {
      // 分类存在，更新数量+1
      const existingCategory = existingCategories[0];
      const { error: updateError } = await supabase
        .from('categories')
        .update({ num: existingCategory.num + 1 })
        .eq('id', existingCategory.id);

      if (updateError) {
        console.error(`更新分类 "${trimmedCategory}" 时出错:`, updateError);
      }
    } else {
      // 分类不存在，插入新分类
      const { error: insertError } = await supabase
        .from('categories')
        .insert([{ name: trimmedCategory, num: 1 }]);

      if (insertError) {
        console.error(`插入分类 "${trimmedCategory}" 时出错:`, insertError);
      }
    }
  }
}

/**
 * 获取所有文章
 */
export async function getAllPosts() {
  const supabase = getSupabaseClient();
  
  // 获取所有文章
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("获取文章时出错:", postsError);
    throw postsError;
  }

  return posts;
}

/**
 * 获取所有公开的文章
 */
export async function getAllPublicPosts() {
  const supabase = getSupabaseClient();
  
  // 获取所有公开文章
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("获取公开文章时出错:", postsError);
    throw postsError;
  }

  return posts;
}

/**
 * 根据标签获取文章
 */
export async function getPostsByTag(tag: string) {
  const supabase = getSupabaseClient();
  
  // 查找 tags 字段包含当前标签名称的文章
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .or(`tag.ilike.%${tag}%,tag.ilike.%${tag},tag.ilike.${tag}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("根据标签获取文章时出错:", error);
    throw error;
  }

  return data;
}

/**
 * 根据分类获取文章
 * 支持逗号分隔的多个分类，会查找包含该分类的所有文章
 */
export async function getPostsByCategory(category: string) {
  const supabase = getSupabaseClient();
  
  try {
    // 查找 category 字段包含该分类的文章（支持逗号分隔）
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .or(`category.eq.${category},category.ilike.%${category}%,category.ilike.${category},%`)
      .order("created_at", { ascending: false });

    if (error) {
      // 如果 category 字段不存在，返回空数组
      console.warn("根据分类获取文章时出错（可能字段不存在）:", error);
      return [];
    }

    // 过滤出真正包含该分类的文章（因为使用了 ilike，可能匹配到部分字符串）
    const filteredData = (data || []).filter((post: { category?: string }) => {
      if (!post.category) return false;
      const categories = post.category.split(',').map(c => c.trim());
      return categories.includes(category.trim());
    });

    return filteredData;
  } catch (error) {
    console.warn("根据分类获取文章失败:", error);
    return [];
  }
}

/**
 * 获取所有分类（从 categories 表中获取）
 */
export async function getAllCategories() {
  const supabase = getSupabaseClient();
  
  try {
    // 从 categories 表中获取所有分类
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("num", { ascending: false });

    if (error) {
      console.warn("获取分类时出错:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // 转换为数组格式
    const categories = data.map((category: { name: string; num: number }) => ({
      name: category.name,
      num: category.num
    }));

    return categories;
  } catch (error) {
    console.warn("获取分类失败:", error);
    return [];
  }
}

/**
 * 获取所有标签
 */
export async function getAllTags() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("num", { ascending: false });

  if (error) {
    console.error("获取标签时出错:", error);
    throw error;
  }

  return data;
}

/**
 * 根据slug获取单篇文章
 */
export async function getPostBySlug(slug: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .limit(1);

  if (error) {
    console.error("根据slug获取文章时出错:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
}

/**
 * 根据ID获取单篇文章（支持数字ID或UUID字符串）
 * Supabase会自动处理类型转换
 */
export async function getPostById(id: number | string) {
  const supabase = getSupabaseClient();
  
  console.log("getPostById 调用，参数类型:", typeof id, "值:", id);
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .limit(1);

  if (error) {
    console.error("根据ID获取文章时出错:", error);
    console.error("错误详情:", JSON.stringify(error, null, 2));
    throw error;
  }

  console.log("查询结果，数据条数:", data?.length || 0);

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
}

/**
 * 获取 posts 表中 category 值与 resolvedParams 相等的数据
 */
export async function getPostsByCategoryEqual(resolvedParams: string) {
  const supabase = getSupabaseClient();
  
  try {
    // 查询 posts 表中 category 字段完全等于 resolvedParams 的数据
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category", resolvedParams)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("根据分类精确匹配获取文章时出错:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn("根据分类精确匹配获取文章失败:", error);
    return [];
  }
}
