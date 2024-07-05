import React, { useEffect } from 'react'
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { deleteCoupon, getCoupons } from '../features/coupon/couponSlice';
import Swal from 'sweetalert2';
const columns = [
    {
        title: 'No.',
        dataIndex: 'key',
    },
    {
        title: 'Mã giảm giá',
        dataIndex: 'name',
        defaultSortOrder: "descend",
        sorter: (a, b) => a.name - b.name
    },
    {
        title: 'Ngày hết hạn',
        dataIndex: 'expiry'
    },
    {
        title: 'Giảm',
        dataIndex: 'discount'
    },
    {
        title: 'Hành động',
        dataIndex: 'action'
    }
];
const Coupons = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCoupons());
    }, []);
    const couponState = useSelector((state) => state.coupon.coupons);
    const data = couponState.map((coupon, index) => {
        return {
            key: index + 1,
            name: coupon.name,
            expiry: new Date(coupon.expiry).toLocaleString(),
            discount: coupon.discount + "%",
            action: (
                <>
                    <Link to='/' className='ps-3 text-warning'>
                        <FiEdit />
                    </Link>
                    <button
                        className='ms-3 ps-3 text-danger btn btn-link'
                        onClick={() => handleDelete(coupon._id)}
                    >
                        <MdDelete />
                    </button>
                </>
            )
        };
    });
    const handleDelete = (categoryId) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa loại sản phẩm này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa nó!',
            cancelButtonText: 'Không, hủy!',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteCoupon(categoryId))
                    .unwrap()
                    .then(() => {
                        Swal.fire('Đã xóa!', 'Loại sản phẩm đã được xóa.', 'success');
                        dispatch(getCoupons());
                    })
                    .catch((error) => {
                        Swal.fire('Thất bại!', error.message, 'error');
                    });
            }
        });
    };
    return (
        <div>
            <h3>Mã giảm giá</h3>
            <div>
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    )
}

export default Coupons;
