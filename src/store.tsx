import { create } from 'zustand';

interface InfoBoxData {
  title: string;
  content: string;
}

interface StoreState {
  current_table_reference: string;
  set_current_table_reference: (value: string) => void;

  keeperWalletState: any; // Initial state for Keeper Wallet data (use appropriate type if known)
  setKeeperWalletState: (state: any) => void; // Action to update Keeper Wallet state

  infoBoxData: InfoBoxData | null; // State for InfoBox data
  setInfoBoxData: (data: InfoBoxData | null) => void; // Action to update InfoBox data
}

const useStore = create<StoreState>((set) => ({
  // State for table reference
  current_table_reference: '',
  set_current_table_reference: (value) => set(() => ({ current_table_reference: value })),

  // State for Keeper Wallet
  keeperWalletState: null, // Initial state for Keeper Wallet data
  setKeeperWalletState: (state) => set(() => ({ keeperWalletState: state })), // Action to update the state

  // State for InfoBox data
  infoBoxData: null, // Initial state for InfoBox
  setInfoBoxData: (data) => set(() => ({ infoBoxData: data })), // Action to update InfoBox data
}));

export default useStore;
