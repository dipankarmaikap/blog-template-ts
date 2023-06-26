import { useState } from "react";
import { getStoryblokApi } from "@storyblok/react";
import { useLoaderData } from "@remix-run/react";
import type { PostStoryblok } from "~/types";

import PostCard from "./PostCard";

const PostsList = ({ grid }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { posts: firstsPosts, total } = useLoaderData();
  const [posts, setPosts] = useState(firstsPosts);

  const sbApi = getStoryblokApi();
  const resolveRelations = [
    "post.categories",
    "post.tags",
    "post.author",
    "post.comments",
  ];

  const fetchPosts = async (page: number) => {
    const { data: blog } = await sbApi.get(`cdn/stories`, {
      version: "draft",
      starts_with: "blog/",
      per_page: 4,
      page,
      is_startpage: 0,
      resolve_relations: resolveRelations,
    });

    setPosts((prevPosts) => [...prevPosts, ...blog.stories]);
  };

  const loadMore = () => {
    let nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPosts(nextPage);
  };
  return (
    <div>
      <div className={grid && "grid grid-cols-2 gap-5"}>
        {posts?.map((p: PostStoryblok) => {
          const post = p.content;
          return <PostCard post={p} key={post._uid} grid={grid} />;
        })}
      </div>
      {posts.length < total && (
        <div className="flex items-center">
          <button className="button mx-auto py-4 px-7" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default PostsList;