import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className="font-inter bg-gray-200
"
    >
      {children}
      <Toaster richColors />
    </main>
  );
}
