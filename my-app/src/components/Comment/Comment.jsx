import { useState } from "react";
import "./Comment.css";
import { FaStar } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function Comment(props) {
  const product = props.product;
  const url = useLocation();
  const pathname = url.pathname.split('/'); // Tách chuỗi thành một mảng
  const lastSegment = pathname[pathname.length - 1]; // Lấy phần tử cuối cùng
  // State để lưu lựa chọn sao
  const [selectedStar, setSelectedStar] = useState('all'); // Mặc định là tất cả

  // Hàm để lọc đánh giá
  const filterRatings = (star) => {
    if (star === 'all') {
      return product.ratings;
    }
    return product.ratings.filter((item) => item.star === parseInt(star));
  };

  // Các sao có thể lọc: 1 sao, 2 sao, 3 sao, 4 sao, 5 sao, tất cả
  const starOptions = ['all', '1', '2', '3', '4', '5'];

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

  // Tính số lượng đánh giá cho từng sao (range từ 1 đến 5 sao)
  const starCounts = Array(5).fill(0);
  product.ratings.forEach(item => {
    if (item.star >= 1 && item.star <= 5) {
      starCounts[item.star - 1] += 1;
    }
  });

  // Tính tổng số sao (totalrating) và tổng số đánh giá
  const totalRating = product.totalrating.toFixed(1);
  const totalReviews = product.ratings.length;

  return (
    <>
      <div className="post-cmt">
        <div className="d-flex justify-content-center">

          {/* Hiển thị tổng số đánh giá */}
          <div className="total-reviews">
            <div className="rating-summary">
              <span className="total-rating">
                {totalRating}/5
              </span>
              <div className="star-rating-summary">
                <StarRating count={Math.round(totalRating)} />
              </div>
              <a
                href={lastSegment !== `danh-gia` ? `${url.pathname}/danh-gia` : `#comments`}
                className="review-count"
                onMouseEnter={(e) => {
                  if (lastSegment === 'danh-gia') {
                    // Tạm thời ẩn đường dẫn URL khi hover
                    e.target.setAttribute('data-url', e.target.href);
                    e.target.removeAttribute('href');
                  }
                }}
                onMouseLeave={(e) => {
                  // Khôi phục lại đường dẫn sau khi rời chuột
                  if (e.target.getAttribute('data-url') && lastSegment === 'danh-gia') {
                    e.target.setAttribute('href', e.target.getAttribute('data-url'));
                  }
                }}
                onClick={(e) => {
                  if (lastSegment === 'danh-gia') {
                    e.preventDefault();  // Ngừng hành động mặc định của thẻ <a>
                    // Thực hiện hành động khi đã ẩn #comments, ví dụ: scroll tới phần nhận xét
                    const commentsSection = document.getElementById('comments');
                    commentsSection.scrollIntoView({ behavior: 'smooth' }); // Cuộn đến phần nhận xét
                  }
                }}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {totalReviews} đánh giá
              </a>
            </div>
          </div>

          <div className="separator" />

          {/* Hiển thị số lượng đánh giá cho từng sao */}
          <div className="star-breakdown">
            <h5>Phân tích số lượng đánh giá theo sao</h5>
            {starCounts.map((count, index) => (
              <div key={index} className="star-breakdown-item">
                <span>{index + 1} sao</span>
                <div className="star-progress">
                  <div
                    className="star-bar"
                    style={{
                      width: `${(count / totalReviews) * 100}%`,
                      backgroundColor: (count === 0) ? '#ffffff' : '#ffcc00' // Thay màu vàng thành trắng nếu không có đánh giá
                    }}
                  />
                </div>
                <span>{count} đánh giá</span>
              </div>
            ))}
          </div>
        </div>

        <div id="comments" className="cmt-list">
          {/* Bộ lọc sao bằng button */}
          <label>Lọc theo</label>
          <div className="filter">
            <div className="star-buttons">
              {starOptions.map((star) => (
                <button
                  key={star}
                  className={`btn btn-star-button ${selectedStar === star ? 'active' : ''}`}
                  onClick={() => setSelectedStar(star)}
                >
                  {star === 'all' ? (
                    'Tất cả'
                  ) : (
                    <>
                      <FaStar
                        size={20}
                        color={selectedStar === star ? '#ffcc00' : '#cccccc'}
                      />
                      <span className="star-count">{star}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
          {product.ratings && product.ratings.length > 0 ? (
            filterRatings(selectedStar).map((item, index) => (
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
    </>
  );
}

export default Comment;
