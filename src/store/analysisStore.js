import { create } from 'zustand';

export const useAnalysisStore = create((set) => ({
  packData:    null,
  packResults: null,
  cellData:    [],
  cellResults: null,

  setPackData:    (data)    => set({ packData: data }),
  setPackResults: (results) => set({ packResults: results }),
  setCellData:    (data)    => set({ cellData: data }),
  setCellResults: (results) => set({ cellResults: results }),

  reset: () => set({ packData: null, packResults: null, cellData: [], cellResults: null }),
}));
