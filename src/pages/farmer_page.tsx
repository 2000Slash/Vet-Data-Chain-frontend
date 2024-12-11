import InfoBox_Text from "../components/login/infobox";
import Header from '../components/shared_components/Header';
import Pending_List from "../components/farmer/PendingList";
import Table from "../components/shared_components/Table";

const Farmer_Page = () => {
  const rowContent = [
    { name: 'Alice', age: 25, gender: 'Female', height: '5ft 6in' },
    { name: 'Bob', age: 30, gender: 'Male', height: '5ft 10in' },
    { name: 'Charlie', age: 35, gender: 'Male', height: '6ft' },
    { name: 'Diana', age: 28, gender: 'Female', height: '5ft 4in' },
  ];

  const columnData = [
    { key: 'name', title: 'Name' },
    { key: 'age', title: 'Age' },
    { key: 'gender', title: 'Gender' },
    { key: 'height', title: 'Height' },
  ];

  return (
    <div>
    <Header/>
    <InfoBox_Text title="Vet-Data-Chain" content="This is the Farmer page"/>
    <Pending_List></Pending_List>
    <Table rowContent={rowContent} columnData={columnData} />
    </div>

  );
};

export default Farmer_Page;
