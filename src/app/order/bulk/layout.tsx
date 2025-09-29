export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex grow  flex-col group/design-root overflow-x-hidden">
      {/* Layout UI */}
      {/* Place children where you want to render a page or nested layout */}
      <main className="flex grow ">{children}</main>
    </div>
  );
}
