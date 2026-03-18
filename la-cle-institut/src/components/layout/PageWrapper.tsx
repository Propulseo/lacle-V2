interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <main id="main-content" className={`pt-16 ${className}`}>
      {children}
    </main>
  );
}
