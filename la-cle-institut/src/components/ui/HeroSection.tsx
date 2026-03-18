interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function HeroSection({
  title,
  subtitle,
  children,
  className = "",
  fullHeight = false,
}: HeroSectionProps) {
  return (
    <section
      className={`flex flex-col justify-center ${
        fullHeight
          ? "min-h-screen"
          : "pb-20 pt-32 md:pb-28 md:pt-40"
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
        <h1 className="max-w-4xl font-serif text-4xl font-light leading-[1.1] text-ivoire md:text-5xl lg:text-6xl xl:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-cendre md:text-xl">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
