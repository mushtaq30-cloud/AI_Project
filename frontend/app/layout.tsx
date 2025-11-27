import "./globals.css";

export const metadata = {
  title: "Business Idea Generator | AI-Powered Innovation",
  description: "Generate innovative business ideas instantly using AI. Get inspired with creative business concepts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900 text-gray-900 dark:text-gray-50 transition-colors duration-300 antialiased">
        {children}
      </body>
    </html>
  );
}
