import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import PaymentGenerator from "./pages/PaymentGenerator";
import PayPage from "./pages/PayPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<PaymentGenerator />} />
                    <Route path="pay/:orderId" element={<PayPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
