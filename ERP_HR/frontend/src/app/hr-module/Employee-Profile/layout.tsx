import Sidebar from "@/app/hr-module/sidbar";

export default function EmployeeProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-4 overflow-hidden">{children}</div>
    </div>
  );
}
