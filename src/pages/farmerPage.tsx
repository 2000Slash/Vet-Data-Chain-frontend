import Header from "../components/shared_components/Header";
import Pending_List from "../components/farmer/PendingList";


const Farmer_Page = () => {


  return (
    <div>
      <Header role="Farmer" />
      <Pending_List></Pending_List>
    </div>
    
  );
};

export default Farmer_Page;
