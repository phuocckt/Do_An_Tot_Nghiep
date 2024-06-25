import React, { useEffect } from 'react'
import CustomerInput from '../Components/CustomerInput';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { createBrand } from '../features/brand/brandSlice';
import Swal from 'sweetalert2';

function AddBrand() {
    const dispatch = useDispatch();

    const schema = yup.object().shape({
        title: yup.string()
            .required('Không được bỏ trống')
            .matches(/^[A-Za-zÀ-ỹà-ỹ\s]+$/, 'Chỉ được nhập chữ cái và khoảng trắng')
    });
    const formik = useFormik({
        initialValues: {
            title: ''
        },
        validationSchema: schema,
        onSubmit: values => {
            dispatch(createBrand(values))
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
        <div>
            <h3 className='mb-4 title'>Add Brand</h3>
            <div className=''>
                <form onSubmit={formik.handleSubmit}>
                    <CustomerInput
                        type="text"
                        label="Nhập tên thương hiệu"
                        value={formik.values.title}
                        name="title"
                        onChange={formik.handleChange}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.title}</p>
                    ) : null}
                    <button type='submit' className='btn btn-success border-0 rounded-3'>
                        Thêm
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddBrand;
