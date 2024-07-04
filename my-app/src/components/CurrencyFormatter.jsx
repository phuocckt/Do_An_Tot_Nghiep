// Định dạng số tiền theo định dạng tiền tệ Việt Nam
export const CurrencyFormatter = ({ amount, className }) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return <span className={className}>{formatter.format(amount)}</span>;
};