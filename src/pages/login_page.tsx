import { useState } from 'react';

import InfoBox_Text from "../components/login/infobox";
import Login_box from '../components/login/loginbox';
import Header from '../components/shared_components/Header';

const Login_Page = () => {

  return (
    <div>
    <Header/>
    <InfoBox_Text title="Vet-Data-Chain" content="Vet-Data-Chain is your innovative partner for managing Application
                                                    and Delivery Records (AuA Records) with ease and confidence.
                                                    Designed for veterinarians, farmers, and veterinary authorities,
                                                    this cutting-edge solution simplifies the way vital data is
                                                    recorded, shared, and verified."/>
    <Login_box/>
    </div>

  );
};

export default Login_Page;
