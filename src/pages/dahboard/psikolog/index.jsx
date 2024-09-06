import { useState } from "react";
import Header from "../../../components/Fragments/Dashboard/Headers";

import Content from "../../../components/Fragments/Dashboard/Content/Psikolog/index";
import SidebarPsikolog from "../../../components/Fragments/Dashboard/Sidebar/Psikolog";


// import {toggleDD} from '../../../assets/js/dropdown';
// import {filterDD} from '../../../assets/js/dropdown';

const HomePsikolog = () => {

  const [selectedMenu, setSelectedMenu] = useState('');

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="mt-12 font-sans leading-normal tracking-normal bg-gray-800">
      <Header />

      <div className="flex flex-col md:flex-row">
      <SidebarPsikolog onMenuClick={handleMenuClick} />

        <section className="flex-1">
          <div id="main" className="pb-24 mt-12 bg-gray-100 md:mt-2 md:pb-5">
            <div className="pt-3 bg-gray-800">
              <div className="p-4 text-2xl text-white shadow rounded-tl-3xl bg-gradient-to-r from-blue-900 to-gray-800">
                <h1 className="pl-2 font-bold">{selectedMenu}</h1>
              </div>
            </div>

            <div className="flex">
              <div className="w-full">
              <Content selectedMenu={selectedMenu} />
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePsikolog;