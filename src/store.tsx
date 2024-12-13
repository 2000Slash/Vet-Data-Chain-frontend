import { create } from 'zustand';

interface StoreState {
  current_table_reference: string;
  set_current_table_reference: (value: string) => void;

  keeperWalletState: any; // Initial state for Keeper Wallet data (use appropriate type if known)
  setKeeperWalletState: (state: any) => void; // Action to update Keeper Wallet state
}

const useStore = create<StoreState>((set) => ({
  // State for table reference
  current_table_reference: '',
  set_current_table_reference: (value) => set(() => ({ current_table_reference: value })),

  // State for Keeper Wallet
  keeperWalletState: null, // Initial state for Keeper Wallet data
  setKeeperWalletState: (state) => set(() => ({ keeperWalletState: state })), // Action to update the state
}));

export default useStore;
