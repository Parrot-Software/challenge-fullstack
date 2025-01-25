import Sidebar from "../components/sidebar";

export default function ReportsLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      {children}
    </div>
  );
}
