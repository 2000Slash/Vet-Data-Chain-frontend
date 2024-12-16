import { create } from 'zustand';

interface InfoBoxData {
  title: string;
  content: string;
}

interface StoreState {
  current_table_reference: string;
  set_current_table_reference: (value: string) => void;

  keeperWalletState: any; 
  setKeeperWalletState: (state: any) => void; 

  infoBoxData: InfoBoxData | null; 
  setInfoBoxData: (data: InfoBoxData | null) => void; 
}

const useStore = create<StoreState>((set) => ({
  
  current_table_reference: '',
  set_current_table_reference: (value) => set(() => ({ current_table_reference: value })),

  
  keeperWalletState: null, 
  setKeeperWalletState: (state) => set(() => ({ keeperWalletState: state })), 

  
  infoBoxData: { title: '', content: '' }, 
  setInfoBoxData: (data) => set(() => ({ infoBoxData: data })), 
}));

export default useStore;
