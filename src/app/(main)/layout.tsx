import MenuBar from "@/components/Layout/Menu";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MenuBar />
      <div className="flex flex-col flex-1 lg:h-full lg:overflow-y-auto">
        {children}
      </div>
    </>
  );
}
