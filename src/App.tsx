import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import NavBar from "./components/shared/mobile_nav";
import ConnectWallet from "./pages/connect_wallet";
import Deposit from "./pages/deposit-withdraw";
import Affiliate from "./pages/affiliate";
import Vaults from "./pages/vaults";
import NFTs from "./pages/nfts";
import ProtectedRoute from "./components/shared/protected_routes";
import ResponsiveNav from "./components/shared/responsive_nav";
import LoadingSpinner from "./components/loadingSpinner";

const App = () => {
  return (
    <BrowserRouter>
      <LoadingSpinner />
      <ResponsiveNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connect-wallet" element={<ConnectWallet />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/deposit-withdraw" element={<Deposit />} />
          <Route path="/vaults" element={<Vaults />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/nfts" element={<NFTs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
