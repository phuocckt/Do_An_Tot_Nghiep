import React from 'react'
import CustomerInput from '../Components/CustomerInput';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { createCoupon } from '../features/coupon/couponSlice';
import Swal from 'sweetalert2';

function AddCoupon() {
    const dispatch = useDispatch();

    const schema = yup.object().shape({
        name: yup.string()
            .required('Không được bỏ trống')
            .matches(/^[A-Za-z0-9\s]+$/, 'Không được nhập kí tự đặc biệt'), // Chỉ cho phép chữ cái và số
        expiry: yup.date()
            .required('Không được bỏ trống')
            .min(new Date(), 'Ngày hết hạn không được nhỏ hơn ngày hiện tại'), // Ngày hết hạn không được nhỏ hơn ngày hiện tại
        discount: yup.number()
            .required('Không được bỏ trống')
            .typeError('Chỉ được nhập số') // Chỉ cho phép nhập số
            .min(0, 'Giảm giá phải lớn hơn hoặc bằng 0') // Giảm giá phải lớn hơn hoặc bằng 0
    });
    const formik = useFormik({
        initialValues: {
            name: '',
            expiry: '',
            discount: ''
        },
        validationSchema: schema,
        onSubmit: values => {
            dispatch(createCoupon(values))
                .unwrap()
                .then(() => {
                    Swal.fire({
                        title: "Thêm thành công!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Thêm thất bại!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                });
        },
    });
    return (
        <div className="container">
            <h3 className='mb-4 title'>Thêm mã giảm giá</h3>
            <div className=''>
                <form onSubmit={formik.handleSubmit}>
                    <CustomerInput
                        type="text"
                        label="Nhập mã giảm giá"
                        value={formik.values.name}
                        name="name"
                        onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.name}</p>
                    ) : null}
                    <CustomerInput
                        type="date"
                        label="Nhập ngày hết hạn"
                        value={formik.values.expiry}
                        name="expiry"
                        onChange={formik.handleChange}
                    />
                    {formik.touched.expiry && formik.errors.expiry ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.expiry}</p>
                    ) : null}
                    <CustomerInput
                        type="number"
                        label="Giảm bao nhiêu"
                        value={formik.values.discount}
                        name="discount"
                        onChange={formik.handleChange}
                    />
                    {formik.touched.discount && formik.errors.discount ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.discount}</p>
                    ) : null}
                    <button type='submit' className='btn btn-success border-0 rounded-3'>
                        Thêm
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddCoupon;
