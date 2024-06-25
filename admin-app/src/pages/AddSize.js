import React from 'react'
import CustomerInput from '../Components/CustomerInput';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { createSize } from '../features/size/sizeSlice';
import Swal from 'sweetalert2';

function AddSize() {
    const dispatch = useDispatch();

    const schema = yup.object().shape({
        title: yup.string()
            .required('Không được bỏ trống')
            .matches(/^[0-9.]+$/, 'Chỉ được nhập kí tự số và kí tự .')
    });
    const formik = useFormik({
        initialValues: {
            title: ''
        },
        validationSchema: schema,
        onSubmit: values => {
            dispatch(createSize(values))
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
            <h3 className='mb-4 title'>Thêm size</h3>
            <div className=''>
                <form onSubmit={formik.handleSubmit}>
                    <CustomerInput
                        type="text"
                        label="Nhập size"
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

export default AddSize;
