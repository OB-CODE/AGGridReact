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
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

export const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([
    {
      a1: "level 1 - 111",
      b1: "level 1 - 222",
      children: [
        {
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
      a1: "level 1 - 111",
      b1: "level 1 - 222",
      children: [
        {
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
  ]);
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

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <div className="flex flex-row w-full justify-between pb-3">
          <button className="bg-fuchsia-500 hover:text-black shadow-sm rounded-md hover:bg-fuchsia-300 py-1 m-1 px-3">
            Update Via Row Data
          </button>
          <button className="bg-fuchsia-500 hover:text-black shadow-sm rounded-md hover:bg-fuchsia-300 py-1 m-1 px-3">
            Update Via Transactions
          </button>
          <button className="bg-fuchsia-500 hover:text-black shadow-sm rounded-md hover:bg-fuchsia-300 py-1 m-1 px-3">
            Update Via ...
          </button>
        </div>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          groupDefaultExpanded={1}
          masterDetail={true}
          detailRowAutoHeight={true}
          detailCellRendererParams={detailCellRendererParams}
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
