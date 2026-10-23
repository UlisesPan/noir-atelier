import Image from "next/image";

export function AuthShell({
  eyebrow,
  title,
  description,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page grid min-h-[calc(100dvh-8rem)] items-center gap-12 py-12 lg:grid-cols-2 lg:gap-20">
      <div className="relative hidden aspect-[4/5] max-h-[78vh] overflow-hidden rounded-[2rem] bg-cream lg:block">
        <Image src={image} alt="" fill unoptimized className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <blockquote className="absolute inset-x-0 bottom-0 p-10 text-ivory">
          <p className="font-display text-3xl leading-snug italic">“Una fragancia es una firma: invisible, pero inconfundible.”</p>
          <footer className="mt-3 text-xs tracking-[0.2em] text-ivory/70 uppercase">— Noir Atelier</footer>
        </blockquote>
      </div>
      <div className="mx-auto w-full max-w-md animate-fade-up">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-5xl">{title}</h1>
        <p className="mt-3 mb-10 text-muted">{description}</p>
        {children}
      </div>
    </div>
  );
}
