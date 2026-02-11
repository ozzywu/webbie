import { ArticleForm } from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
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
        New Article
      </h1>
      <ArticleForm />
    </div>
  );
}
