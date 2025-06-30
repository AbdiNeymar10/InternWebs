import Sidebar from "@/app/hr-module/sidbar";

export default function EmployeeProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto">{children}</div>
    </div>
  );
}
