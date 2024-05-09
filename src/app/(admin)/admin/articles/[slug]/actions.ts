"use server";
import { github } from "@/lib/github-api";
import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

type Props = {
  content: string;
  slug: string;
  sha: string;
  branch: string | null;
  commitMessage: string;
  title: string;
};

export const createPullRequest = async (
  options: Pick<Props, "slug" | "content" | "branch">,
  formData: FormData
) => {
  const form = Object.fromEntries(formData);
  const content = options.content;
  const commitMessage = form.commit_name.toString() || "";
  const title = form.pr_title.toString() || "";
  const body = form.pr_description.toString() || "";

  const branchData = await github.getBranch(options.branch);
  let branch = "";
  let sha = "";

  if (branchData.error) {
    const data = await github.createBranch(options.slug);
    branch = data.branch;
    sha = data.sha;
  } else {
    branch = branchData.branch;
    sha = branchData.sha;
  }

  await github.updateFile({ branch, sha, content, slug: options.slug, commitMessage });
  const pr_number = await github.createPullRequest(body, title, branch);

  await createClient("server_action")
    .from("articles")
    .update({ status: "in_review", pr_number })
    .eq("slug", options.slug);
  redirect("/admin/articles");
};

export async function deleteArticle(slug: string, imgPath: string, branch: string) {
  const supabase = createClient("server_action");
  await Promise.all([
    supabase.from("articles").delete().eq("slug", slug),
    supabase.storage.from("images").remove([imgPath]),
    github.deleteBranch(branch)
  ]);
}