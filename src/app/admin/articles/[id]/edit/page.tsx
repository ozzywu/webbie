import { getArticleById } from "@/lib/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <h1
        className="text-xl mb-6"
        style={{
          color: "#1a1a1a",
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500,
        }}
      >
        Edit Article
      </h1>
      <ArticleForm article={article} />
    </div>
  );
}
