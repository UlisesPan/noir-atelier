import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/account-nav";
import { getCurrentUser } from "@/lib/server/session";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="mb-10">
        <p className="eyebrow">Mi cuenta</p>
        <h1 className="mt-3 text-5xl">Hola, {user.name.split(" ")[0]}</h1>
      </header>
      <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-14">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
