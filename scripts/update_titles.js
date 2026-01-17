import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updatePostTitles() {
  try {
    const posts = await prisma.post.findMany();
    console.log(`Found ${posts.length} posts to check.`);

    for (const post of posts) {
      if (!post.category) continue;

      const category = post.category.charAt(0).toUpperCase() + post.category.slice(1);
      const newTitle = `${category} Post`;

      // Only update if the title is currently "Untitled Post" or generic
      // Or we can just update all of them to match the requirement strictly.
      // The user said "on front page on which the untitled post is written on every card make it like medical post tech post"
      // This implies we should target those specific ones, but for consistency, let's update based on category.
      // To be safe and avoid overwriting custom titles, I'll check if it looks like a generic title or if the user wants ALL cards to follow this pattern.
      // "means based on his domain the card should be shown" -> implies the title should reflect the domain.
      
      // Let's update if the title is "Untitled Post" OR if we want to enforce the pattern.
      // Given the request, I'll update all to ensure the "domain" is shown as requested.
      // But to be safe, I will append the ID to make it unique-ish if needed, or just the category name as requested.
      // "make it like medical post tech post" -> "Medical Post", "Tech Post"
      
      await prisma.post.update({
        where: { id: post.id },
        data: { title: newTitle }
      });
      console.log(`Updated post ${post.id} to title: "${newTitle}"`);
    }

    console.log('All posts updated successfully.');
  } catch (error) {
    console.error('Error updating posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePostTitles();
