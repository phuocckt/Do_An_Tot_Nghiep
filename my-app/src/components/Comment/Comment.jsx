import "./Comment.css";
import { FaStar } from "react-icons/fa";

function Comment(props) {
  const product = props.product;

  const StarRating = ({ count }) => {
    const totalStars = 5;
    const stars = Array(totalStars)
      .fill(0)
      .map((_, index) => (
        <FaStar
          key={index}
          className={index < count ? "text-warning" : "text-secondary"}
        />
      ));

    return <div className="star-rating">{stars}</div>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="comments">
        <div className="post-cmt">
          <h4>Các đánh giá từ khách hàng đã mua sản phẩm:</h4>
          <div className="cmt-list">
            {product.ratings && product.ratings.length > 0 ? (
              product.ratings.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex">
                    <div className="user">
                      <div className="user-img">
                        {item.postedby.images?.length > 0 ? (
                          <img
                            src={item.postedby.images[0]?.url}
                            alt="no_image"
                            className="rounded-circle"
                            fluid
                          />
                        ) : (
                          <img
                            src="../hinh/user-none.jpg"
                            alt="no_image"
                            className="rounded-circle"
                            fluid
                          />
                        )}
                      </div>
                      <div className="user-meta">
                        <div className="name p-0">
                          {item.postedby.firstname +
                            " " +
                            item.postedby.lastname}
                        </div>
                        <div className="day text-warning">
                          <StarRating count={item.star} />
                          <span className="date text-muted ms-2">
                            {formatDate(item.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cmt">{item.comment}</div>
                </div>
              ))
            ) : (
              <p>Chưa có đánh giá ...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;