import "./globals.css";

export const metadata = {
  title: "Interview Coach",
  description: "AI-powered mock technical interviews with structured feedback",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">{children}</body>
    </html>
  );
}
