import "./Comment.css";

function Comment(props) {
  const product = props.product;
  return (
    <>
      <div className="comments">
        <div className="post-cmt">
          <h1>Đánh giá từ khách hàng</h1>
          <div className="cmt-list">
            {product.ratings != [] &&
              product.ratings.map((item) => {
                return (
                  <>
                    <div className="flex">
                      <div className="user">
                        <div className="user-img">
                          {item.postedby.images.length > 0 ? (
                            <img
                              src={item.postedby.images[0]?.url}
                              alt="no_image"
                              className="rounded-circle"
                              style={{ width: "20px" }}
                              fluid
                            />
                          ) : (
                            <img
                              src="../hinh/user-none.jpg"
                              alt="no_image"
                              className="rounded-circle"
                              style={{ width: "20px" }}
                              fluid
                            />
                          )}
                        </div>
                        <div className="user-meta">
                          <div className="name">
                            {item.postedby.firstname +
                              " " +
                              item.postedby.lastname}
                          </div>
                          <div className="day">{item.star} sao</div>
                        </div>
                      </div>
                    </div>
                    <div className="cmt">{item.comment}</div>
                  </>
                );
              })}

            {/* <div className='cmt-reply'>
                            <div className='flex'>
                                <div className='user'>
                                    <div className='user-img'><img src='../hinh/1.png' /></div>
                                    <div className='user-meta'>
                                        <div className='name'>dfgdfgd - <span className='name-reply'>dfhgdffg</span> - <span>Admin</span></div>
                                        <div className='day'>10 day ago</div>
                                    </div>
                                </div>
                            </div>
                            <div className='cmt'>dfghdfgdf</div>
                        </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;
