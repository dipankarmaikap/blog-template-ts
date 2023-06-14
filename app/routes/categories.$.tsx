import { json } from "@remix-run/node";
import { useStoryblokData } from "~/hooks";
import { getStoryblokApi } from "@storyblok/react";
import type { LoaderArgs } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/node";
import { getSeo } from "~/utils";

export const loader = async ({ params }: LoaderArgs) => {
  let slug = params["*"] ?? "home";
  const sbApi = getStoryblokApi();
  const resolveRelations = ["post.categories", "post.tags", "post.author"];

  const { data } = await sbApi.get(`cdn/stories/categories/${slug}`, {
    version: "draft",
  });

  const { data: categories } = await sbApi.get(`cdn/stories`, {
    version: "draft",
    starts_with: "categories/",
    is_startpage: 0,
  });

  const seo = data?.story?.content?.seo_plugin;

  const { data: postsByCategory } = await sbApi.get(`cdn/stories/`, {
    version: "draft",
    starts_with: "blog/",
    is_startpage: 0,
    resolve_relations: resolveRelations,
    filter_query: {
      categories: {
        in_array: data.story.uuid,
      },
    },
  });

  return json({
    story: data?.story,
    postsByCategory: postsByCategory?.stories,
    categories: categories?.stories,
    seo,
  });
};

export const meta: V2_MetaFunction = ({ data }) => {
  return getSeo(data.seo, data.story.name);
};

const CategoryPage = () => useStoryblokData();

export default CategoryPage;