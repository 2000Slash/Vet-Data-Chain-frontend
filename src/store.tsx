import { create } from 'zustand';


interface StoreState {
  current_table_reference: string;
  set_current_table_reference: (value: string) => void; 
}

const useStore = create<StoreState>((set) => ({
  
  current_table_reference: '',
  set_current_table_reference: (value) => set(() => ({ current_table_reference: value }))

}));

export default useStore;
