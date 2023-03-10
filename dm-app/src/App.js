import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RootLayout from './RootLayout/RootLayout';
import Login from './Login/Login';
import Register from './Register/Register';
import EditProfile from './EditProfile/EditProfile';
import TransactionHistory from './TransactionHistory/TransactionHistory';
import ItemDetails from './ItemDetails/ItemDetails';
import UserDetails from './UserDetails/UserDetails';
import AllUsers from './AllUsers/AllUsers';
import UserInventory from './UserInventory/UserInventory';
import InventoryControl from './InventoryControl/InventoryControl';
import AdminHome from './AdminHome/AdminHome';
import Home from './Home/Home';
import SendOtpCode from './SendOtpCode/SendOtpCode';
import ResetPassword from './ResetPassword/ResetPassword';
import InputOtpCode from './InputOtpCode/InputOtpCode';
import IndexPage from './indexPage/indexPage';
import TestComp from './TestComp/TestComp';
import TestComp2 from './TestComp/TestComp2';
import Products from './Products/Products';
import Categories from './Categories/Categories';
import NewInventory from './NewInventory/NewInventory';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout />} >
          <Route index element={<IndexPage />} />
          <Route path='login' element={<Login />} />
          <Route path='home' element={<Home />} />
          <Route path='register' element={<Register />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='reset-password' element={<SendOtpCode />} />
          <Route path='transaction-history' element={<TransactionHistory />} />
          <Route path='item-details' element={<ItemDetails />} />
          <Route path='user-details' element={<UserDetails />} />
          <Route path='all-users' element={<AllUsers />} />
          <Route path='user-inventory' element={<UserInventory />} />
          <Route path='inventory-control' element={<InventoryControl />} />
          <Route path='admin-home' element={<AdminHome />} />
          <Route path='new-password' element={<ResetPassword />} />
          <Route path='password-otp' element={<InputOtpCode />} />
          <Route path='testComp' element={<TestComp />} />
          <Route path='testComp2' element={<TestComp2 />} />
          <Route path='products' element={<Products />} />
          <Route path='categories' element={<Categories />} />
          <Route path='new-inventory' element={<NewInventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
