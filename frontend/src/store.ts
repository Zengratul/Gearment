import { create } from 'zustand';

interface BearState {
  bears: number;
  increase: () => void;
}

export const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
})); 