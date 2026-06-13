import ExcelHeader from "@/components/ExcelHeader";
import ExcelRibbon from "@/components/ExcelRibbon";
import FormulaBar from "@/components/FormulaBar";
import Spreadsheet from "@/components/Spreadsheet";
import SheetTabs from "@/components/SheetTabs";
import StatusBar from "@/components/StatusBar";
import { useHotkeys } from "@/hooks/useHotkeys";

export default function Home() {
  useHotkeys();

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      <ExcelHeader />
      <ExcelRibbon />
      <FormulaBar />
      <Spreadsheet />
      <SheetTabs />
      <StatusBar />
    </div>
  );
}
