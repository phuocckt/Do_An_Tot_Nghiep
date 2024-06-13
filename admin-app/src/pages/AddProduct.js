import React, { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomerInput from '../Components/CustomerInput';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getBrands } from '../features/brand/brandSlice';
import { getCategories } from '../features/category/categorySlice';
import { getColors } from '../features/color/colorSlice';
import { getSizes } from '../features/size/sizeSlice';
import { Select } from 'antd';
import Multiselect from 'react-widgets/Multiselect';
import "react-widgets/styles.css";

let schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    price: yup.number().required('Price is required'),
    brand: yup.string().required('Brand is required'),
    category: yup.string().required('Category is required'),
    color: yup.array().min(1, 'Color is required').required('Color is required'),
    size: yup.array().min(1, 'Size is required').required('Size is required'),
});

function AddProduct() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getBrands());
        dispatch(getCategories());
        dispatch(getColors());
        dispatch(getSizes());
    }, [dispatch]);
    const brandState = useSelector((state) => state.brand.brands);
    const categoryState = useSelector((state) => state.category.categories);
    const colorState = useSelector((state) => state.color.colors);
    const sizeState = useSelector((state) => state.size.sizes);
    const colors = [];
    colorState.map(i => {
        colors.push({
            _id: i._id,
            color: i.title
        });
    });
    const sizes = [];
    sizeState.map(i => {
        sizes.push({
            _id: i._id,
            size: i.title
        });
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            price: '',
            brand: '',
            category: '',
            color: [],
            size: []
        },
        validationSchema: schema,
        onSubmit: values => {
            alert(JSON.stringify(values));
        },
    });

    return (
        <div>
            <h3 className='mb-4 title'>Add Product</h3>
            <div className=''>
                <form onSubmit={formik.handleSubmit}>
                    <CustomerInput
                        type="text"
                        value={formik.values.title}
                        label="Enter Product Title"
                        name="title"
                        onChange={formik.handleChange("title")}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.title}</p>
                    ) : null}
                    <div className='mb-3'>
                        <ReactQuill
                            theme="snow"
                            value={formik.values.description}
                            name="description"
                            onChange={formik.handleChange("description")}
                        />
                    </div>
                    {formik.touched.description && formik.errors.description ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.description}</p>
                    ) : null}
                    <CustomerInput
                        type="number"
                        value={formik.values.price}
                        label="Enter Product Price"
                        name="price"
                        onChange={formik.handleChange("price")}
                    />
                    {formik.touched.price && formik.errors.price ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.price}</p>
                    ) : null}
                    <Select
                        name='brand'
                        className='form-control mb-3'
                        value={formik.values.brand}
                        onChange={formik.handleChange("brand")}
                    >
                        {brandState.map((i, j) => (
                            <option key={j} value={i.title}>
                                {i.title}
                            </option>
                        ))}
                    </Select>
                    {formik.touched.brand && formik.errors.brand ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.brand}</p>
                    ) : null}
                    <Select
                        name='category'
                        className='form-control mb-3'
                        value={formik.values.category}
                        onChange={formik.handleChange("category")}
                    >
                        {categoryState.map((i, j) => (
                            <option key={j} value={i.title}>
                                {i.title}
                            </option>
                        ))}
                    </Select>
                    {formik.touched.category && formik.errors.category ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.category}</p>
                    ) : null}
                    <Multiselect
                        name="colors"
                        dataKey="_id"
                        textField="color"
                        data={colors}
                        value={formik.values.color}
                        onChange={(value) => formik.setFieldValue('color', value)}
                    />
                    {formik.touched.color && formik.errors.color ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.color}</p>
                    ) : null}
                    <Multiselect
                        name="size"
                        dataKey="_id"
                        textField="size"
                        data={sizes}
                        value={formik.values.size}
                        onChange={(value) => formik.setFieldValue('size', value)}
                    />
                    {formik.touched.size && formik.errors.size ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.size}</p>
                    ) : null}
                    <button type='submit' className='btn btn-success border-0 rounded-3 my-5'>
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
