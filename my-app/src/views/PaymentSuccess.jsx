import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createPaymentOrder } from "../features/order/orderSlice";
import "../styles/paymentSuccess.css"; // Assuming you have a CSS file for styling
import { CurrencyFormatter } from "../components/CurrencyFormatter";

function PaymentSuccess() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has('vnp_Amount')) {
      const params = Object.fromEntries(queryParams.entries());
      dispatch(createPaymentOrder(params));
    }
  }, [location.search, dispatch, ]);

  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get('vnp_Amount');
  const paymentMethod = "VNPAY"; // Assuming VNPAY as the payment method
  const isSuccessful = queryParams.get('vnp_ResponseCode') === '00';
  const chargeId = queryParams.get('vnp_TransactionNo');
  const transactionId = queryParams.get('vnp_TxnRef');
  const date = new Date().toLocaleString();

  return (
    <div className="payment-success-container">
      <h1>Giao dịch thành công!!</h1>
      <div className="success-icon">✔️</div>
      <div className="payment-details">
        <div className="detail">
          <span className="label">Tổng tiền:</span>
          <span><CurrencyFormatter amount={amount/100}/></span>
        </div>
        <div className="detail">
          <span className="label">Phương thức thanh toán:</span>
          <span>{paymentMethod}</span>
        </div>
        <div className="detail">
          <span className="label">Trạng thái:</span>
          <span>{isSuccessful ? "Thành công" : "Thất bại"}</span>
        </div>
        <div className="detail">
          <span className="label">Mã phí:</span>
          <span>{chargeId}</span>
        </div>
        <div className="detail">
          <span className="label">Mã giao dịch:</span>
          <span>{transactionId}</span>
        </div>
        <div className="detail">
          <span className="label">Ngày thanh toán:</span>
          <span>{date}</span>
        </div>
        <div className="d-flex">
          <Link to="/products" className="btn btn-primary">Mua tiếp</Link>
          <Link to="/order" className="btn btn-success">Xem đơn hàng</Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
