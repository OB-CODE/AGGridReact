"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  IDetailCellRendererParams,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { toast, ToastContainer } from "react-toastify";
import { log } from "console";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

// makes a copy of the original and merges in the new values
function copyObject(object: any) {
  // start with new object
  const newObject: any = {};
  // copy in the old values
  Object.keys(object).forEach((key) => {
    newObject[key] = object[key];
  });
  return newObject;
}

const globalRowData = [
  {
    id: 1,
    a1: "level 1 - 111",
    b1: "level 1 - 222",
    children: [
      {
        id: 3,
        a2: "level 2 - 333",
        b2: "level 2 - 444",
        children: [
          { a3: "level 3 - 5551", b3: "level 3 - 6661" },
          { a3: "level 3 - 5552", b3: "level 3 - 6662" },
          { a3: "level 3 - 5553", b3: "level 3 - 6663" },
          { a3: "level 3 - 5554", b3: "level 3 - 6664" },
          { a3: "level 3 - 5555", b3: "level 3 - 6665" },
          { a3: "level 3 - 5556", b3: "level 3 - 6666" },
        ],
      },
    ],
  },
  {
    id: 2,
    a1: "level 1 - 111",
    b1: "level 1 - 222",
    children: [
      {
        id: 5,
        a2: "level 2 - 333",
        b2: "level 2 - 444",
        children: [
          { a3: "level 3 - 5551", b3: "level 3 - 6661" },
          { a3: "level 3 - 5552", b3: "level 3 - 6662" },
          { a3: "level 3 - 5553", b3: "level 3 - 6663" },
          { a3: "level 3 - 5554", b3: "level 3 - 6664" },
          { a3: "level 3 - 5555", b3: "level 3 - 6665" },
          { a3: "level 3 - 5556", b3: "level 3 - 6666" },
        ],
      },
    ],
  },
];

export const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  //   const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "a1", cellRenderer: "agGroupCellRenderer" },
    { field: "b1" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  const detailCellRendererParams = useMemo<any>(() => {
    return {
      // level 2 grid options
      detailGridOptions: {
        columnDefs: [
          { field: "a2", cellRenderer: "agGroupCellRenderer" },
          { field: "b2" },
        ],
        defaultColDef: {
          flex: 1,
        },
        groupDefaultExpanded: 1,
        masterDetail: true,
        detailRowHeight: 240,
        detailRowAutoHeight: true,

        detailCellRendererParams: {
          // level 3 grid options
          detailGridOptions: {
            columnDefs: [
              { field: "a3", cellRenderer: "agGroupCellRenderer" },
              { field: "b3" },
            ],
            defaultColDef: {
              flex: 1,
            },
          },
          getDetailRowData: (params) => {
            params.successCallback(params.data.children);
          },
        } as IDetailCellRendererParams,
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.children);
      },
    } as IDetailCellRendererParams;
  }, []);

  const updateViaRowData = () => {
    const newRowData = rowData.map((row, rowIndex) => {
      if (rowIndex === 0) {
        return {
          ...row,
          a1: "testing A1",
          children: row.children.map((child) => ({
            ...child,
            a2: "change level 2",
          })),
        };
      }
      return row;
    });

    // setRowData(newRowData); // Update state with new reference
    toast("Updated row data successfully");
  };

  const updateViaTransactions = () => {
    // const updatedRow = {
    //   ...rowData[0],
    //   children: rowData[0].children.map((child) => ({
    //     ...child,
    //     b2: "Updated via transaction",
    //   })),
    // };
    const index = 0;
    const itemToUpdate = globalRowData[index];
    const newItem = copyObject(itemToUpdate);
    newItem.a1 = "Test";

    console.log("Updated Row for Transaction:", newItem);

    gridRef.current!.api.applyTransaction({ update: [newItem] });

    // const api = gridRef.current?.api; // Reference to AG Grid API
    // if (api) {
    //   api.applyTransaction({
    //     update: [newItem], // Use unique IDs to match the row
    //   });
    //   toast("Transaction applied successfully");
    // } else {
    //   toast.error("Grid API is not available");
    // }
  };

  const updateByOtherMethod = () => {
    toast("No update made, make new method.");
  };

  const getRowId = useCallback((params) => {
    console.log("Row ID:", params.data.id);
    return params.data.id; // Use a unique field like `id`
  }, []);
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption("rowData", globalRowData);
  }, []);

  return (
    <div style={containerStyle}>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div style={gridStyle}>
        <div className="flex flex-row w-full justify-between pb-3">
          <button
            onClick={() => updateViaRowData()}
            className="bg-fuchsia-500 hover:text-black shadow-sm rounded-md hover:bg-fuchsia-300 py-1 m-1 px-3">
            Update Via Row Data
          </button>
          <button
            onClick={() => updateViaTransactions()}
            className="bg-fuchsia-500 hover:text-black shadow-sm rounded-md hover:bg-fuchsia-300 py-1 m-1 px-3">
            Update Via Transactions
          </button>
          <button
            onClick={() => updateByOtherMethod()}
            className="bg-fuchsia-500 hover:text-black shadow-sm rounded-md hover:bg-fuchsia-300 py-1 m-1 px-3">
            Update Via ...
          </button>
        </div>
        <AgGridReact
          ref={gridRef}
          //   rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          groupDefaultExpanded={1}
          masterDetail={true}
          detailRowAutoHeight={true}
          getRowId={getRowId}
          detailCellRendererParams={detailCellRendererParams}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

// const root = createRoot(document.getElementById("root")!);
// root.render(
//   <StrictMode>
//     <GridExample />
//   </StrictMode>
// );
