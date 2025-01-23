import PostCard from "@/components/PostCard";
import { getCollection } from "@/lib/db";

export default async function Home() {
  const postsCollection = await getCollection("posts");
  const posts = await postsCollection?.find().sort({ $natural: -1 }).toArray();

  if (!posts) {
    return (
      <p>Failing to load posts</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {posts.map((post) => (
        <div key={post._id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
