import type { Metadata } from "next";
import { ItemDetailContent } from "./_components/ItemDetailContent";

async function getItem(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/items/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.item || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    return {
      title: "Item Not Found | EduPro",
      description: "The requested learning material could not be found.",
    };
  }

  return {
    title: `${item.title} | EduPro`,
    description: item.description.slice(0, 160),
  };
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ItemDetailContent id={id} />;
}