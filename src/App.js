import { useEffect, useState, useRef, useContext } from "react";

import Header from "./components/header/header.component";
import Footer from "./components/footer/footer.component";
import NewOrder from "./components/new-order/new-order.component";
import PaymentPending from "./components/payment-pending/payment-pending.component";
import PhoneVerification from "./components/phone-verification/phone-verification.component";
import PhotoVerification from "./components/photo-verification/photo-verification.component";
import { Context } from "./components/intl-wrapper/intl-wrapper.component";

import { getOrder } from "./api/buy-bch.api";

import "./App.scss";

function App() {
  const [order, setOrder] = useState({});

  const context = useRef(useContext(Context));

  useEffect(() => {
    const orderId = localStorage.getItem("orderId");
    if (orderId) {
      async function fetchOrder() {
        const response = await getOrder(orderId);
        if (response.order) {
          setOrder(response.order);
          context.current.selectLanguage(response.order.locale);
        } else {
          localStorage.clear();
        }
      }

      fetchOrder();
    }
  }, []);

  const renderSwitch = () => {
    if (order["status"] === "pending_payment") {
      return (
        <PaymentPending
          paymentUrl={order["payment_url"]}
          bgnAmount={order["bgn_amount"]}
        />
      );
    }

    if (order["status"] === "pending_id") {
      if (order["id_pending"] === "phone") {
        return (
          <PhoneVerification
            orderId={order["id"]}
            setOrder={setOrder}
            bgnAmount={order["bgn_amount"]}
          />
        );
      } else if (
        order["id_pending"] === "id_photo" ||
        order["id_pending"] === "face_photo" ||
        order["id_pending"] === "declaration_form_1" ||
        order["id_pending"] === "declaration_form_2"
      ) {
        return (
          <PhotoVerification
            orderId={order["id"]}
            setOrder={setOrder}
            photoId={order["id_pending"]}
            declarationFormUrl={order["id_ext_url"]}
            bgnAmount={order["bgn_amount"]}
          />
        );
      }
    }
    return <NewOrder setOrder={setOrder} />;
  };

  return (
    <div className="App">
      <Header />
      <div className="contents">{renderSwitch()}</div>
      <Footer />
    </div>
  );
}

export default App;
