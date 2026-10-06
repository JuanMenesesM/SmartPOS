import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export default function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="p-6 space-y-6">
      {title && (
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      )}
      {children}
    </div>
  );
}
