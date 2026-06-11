import { getVariant } from "@/config/site";
import { LandingApp } from "@/components/landing";

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const params = await searchParams;
  return <LandingApp variantId={getVariant(params.v)} />;
}
