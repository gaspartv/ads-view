import { CharacterTable } from "./components/character-table";
import { getCharacters } from "@/app/actions/product-character";
import {
  getWorlds,
  getCharms,
  getOutfits,
  getMounts,
} from "@/app/actions/info";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Dashboard - Personagens",
};

export default async function CharactersDashboardPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const search =
    typeof searchParams?.search === "string" ? searchParams.search : "";
  const orderBy =
    typeof searchParams?.orderBy === "string"
      ? searchParams.orderBy
      : "createdAt";
  const orderType =
    typeof searchParams?.orderType === "string"
      ? searchParams.orderType
      : "desc";
  const status =
    typeof searchParams?.status === "string" ? searchParams.status : undefined;
  const featured =
    typeof searchParams?.featured === "string"
      ? searchParams.featured
      : undefined;

  const [response, worldsRes, charmsRes, outfitsRes, mountsRes] =
    await Promise.all([
      getCharacters(page, limit, search, orderBy, orderType, status, featured),
      getWorlds(),
      getCharms(),
      getOutfits(),
      getMounts(),
    ]);

  const characters =
    response?.success && response.data?.data ? response.data.data : [];
  const pagination =
    response?.success && response.data?.pagination
      ? response.data.pagination
      : { total: 0, page: 1, limit: 10, totalPages: 1 };

  const worlds = worldsRes?.success && worldsRes.data ? worldsRes.data : [];
  const charms = charmsRes?.success && charmsRes.data ? charmsRes.data : [];
  const outfits = outfitsRes?.success && outfitsRes.data ? outfitsRes.data : [];
  const mounts = mountsRes?.success && mountsRes.data ? mountsRes.data : [];

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 space-y-8">
      <div className="space-y-4">
        {/* Navegação - Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-sm text-muted-foreground">
          <span>Admin</span>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/admin/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/admin/dashboard/products"
            className="hover:text-foreground transition-colors"
          >
            Produtos
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Personagens</span>
        </nav>
      </div>

      <CharacterTable
        characters={characters}
        pagination={pagination}
        worlds={worlds}
        charms={charms}
        outfits={outfits}
        mounts={mounts}
      />
    </div>
  );
}
