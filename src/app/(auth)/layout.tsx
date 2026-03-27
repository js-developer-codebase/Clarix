export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-gold-500 selection:text-black">
      {children}
    </div>
  );
}
