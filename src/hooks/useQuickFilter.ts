import { AgGridReact } from "ag-grid-react";
import { useRef, useState } from "react";

const useQuickFilter = (gridRef: React.RefObject<AgGridReact<any> | null>) => {
  const searchTextRef = useRef<HTMLInputElement>(null);
  const [quickFilterText, setQuickFilterText] = useState("");

  const applyFilter = () => {
    const filterText = searchTextRef.current?.value || "";
    setQuickFilterText(filterText);
    gridRef.current?.api.setGridOption("quickFilterText", filterText);
  };

  const resetFilter = () => {
    setQuickFilterText("");
    if (searchTextRef.current) {
      searchTextRef.current.value = "";
    }
    gridRef.current?.api.setGridOption("quickFilterText", "");
  };

  return { searchTextRef, quickFilterText, applyFilter, resetFilter };
};

export default useQuickFilter;
