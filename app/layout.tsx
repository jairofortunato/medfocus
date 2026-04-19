import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Med Estudo Focado - ENARE 2023",
  description: "Plataforma de estudo focado para o Exame Nacional de Revalidação de Diplomas Médicos (ENARE)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="bg-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
