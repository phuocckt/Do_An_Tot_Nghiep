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
import 'react-widgets/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropzone from 'react-dropzone';
import { deleteImage, uploadImage } from '../features/upload/uploadSlice';
import { createProduct } from '../features/product/productSlice';
import Swal from 'sweetalert2';

const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    priceOld: yup.number()
        .typeError('Quantity must be a number')
        .positive('Quantity must be a positive number')
        .integer('Quantity must be an integer'),
    price: yup.number()
        .required('Price is required')
        .typeError('Quantity must be a number')
        .positive('Quantity must be a positive number')
        .integer('Quantity must be an integer'),
    brand: yup.string().required('Brand is required'),
    category: yup.string().required('Category is required'),
    color: yup.array(),
    size: yup.array().min(1, 'Size is required').required('Size is required'),
    quantity: yup.number()
        .typeError('Quantity must be a number')
        .positive('Quantity must be a positive number')
        .integer('Quantity must be an integer')
        .required('Quantity is required'),
    image: yup.array().min(1, 'Image is required').required('Image is required'),
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
    const uploadState = useSelector((state) => state.upload.images);

    const colors = colorState.map(i => ({
        _id: i._id,
        color: i.title
    }));

    const sizes = sizeState.map(i => ({
        _id: i._id,
        size: i.title
    }));

    const images = uploadState.map(i => ({
        public_id: i.public_id,
        url: i.url
    }));

    useEffect(() => {
        //formik.setFieldValue('image', images);
        formik.values.image = images;
    }, [images]);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            priceOld: '',
            price: '',
            brand: '',
            category: '',
            color: [],
            size: [],
            quantity: '',
            image: []
        },
        validationSchema: schema,
        onSubmit: values => {
            dispatch(createProduct(values));
            //alert(JSON.stringify(values));
        },
    });
    const {createdProduct, isLoading, isError, isSuccess, message, isCreate } = useSelector(
        (state) => state.product
    );
    useEffect(() => {
        if (!isLoading && isSuccess && isCreate) {
          Swal.fire({
            title: "Thêm thành công!",
            text: "Thêm sản phẩm: " + createdProduct.title,
            icon: "success",
            confirmButtonText: "OK",
          });
        } 
        else if (isError && !isSuccess) {
          Swal.fire({
            title: "Thêm thất bại!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }, [isSuccess, isError, isLoading, message, isCreate]);

    return (
        <div className="container">
            <h3 className='mb-4 title'>Thêm sản phẩm</h3>
            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <CustomerInput
                            type="text"
                            value={formik.values.title}
                            label="Nhập tên sản phẩm"
                            name="title"
                            onChange={formik.handleChange}
                        />
                        {formik.touched.title && formik.errors.title ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.title}</p>
                        ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <CustomerInput
                            type="number"
                            value={formik.values.priceOld}
                            label="Giá tiền cũ"
                            name="priceOld"
                            onChange={formik.handleChange}
                        />
                        {formik.touched.priceOld && formik.errors.priceOld ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.priceOld}</p>
                        ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <CustomerInput
                            type="number"
                            value={formik.values.price}
                            label="Giá tiền"
                            name="price"
                            onChange={formik.handleChange}
                        />
                        {formik.touched.price && formik.errors.price ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.price}</p>
                        ) : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="brand">Thương hiệu</label>
                        <Select
                            name='brand'
                            className='form-control'
                            value={formik.values.brand}
                            onChange={(value) => formik.setFieldValue('brand', value)}
                        >
                            {brandState.map((i, j) => (
                                <option key={j} value={i._id}>
                                    {i.title}
                                </option>
                            ))}
                        </Select>
                        {formik.touched.brand && formik.errors.brand ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.brand}</p>
                        ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="brand">Loại sản phẩm</label>
                        <Select
                            name='category'
                            className='form-control'
                            value={formik.values.category}
                            onChange={(value) => formik.setFieldValue('category', value)}
                        >
                            {categoryState.map((i, j) => (
                                <option key={j} value={i._id}>
                                    {i.title}
                                </option>
                            ))}
                        </Select>
                        {formik.touched.category && formik.errors.category ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.category}</p>
                        ) : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="brand">Màu sắc</label>
                        <Multiselect
                            name="color"
                            dataKey="_id"
                            textField="color"
                            data={colors}
                            value={formik.values.color}
                            onChange={(value) => formik.setFieldValue('color', value)}
                        />
                        {formik.touched.color && formik.errors.color ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.color}</p>
                        ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="brand">Kích thước</label>
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
                    </div>
                    <div className="col-md-6 mb-3">
                        <CustomerInput
                            type="number"
                            value={formik.values.quantity}
                            label="Số lượng"
                            name="quantity"
                            onChange={formik.handleChange}
                        />
                        {formik.touched.quantity && formik.errors.quantity ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.quantity}</p>
                        ) : null}
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="brand">Mô tả</label>
                    <ReactQuill
                        theme="snow"
                        value={formik.values.description}
                        name="description"
                        onChange={(value) => formik.setFieldValue('description', value)}
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.description}</p>
                    ) : null}
                </div>
                <div className='bg-white border-1 p-5 text-center'>
                    <Dropzone onDrop={acceptedFiles => dispatch(uploadImage(acceptedFiles))}>
                        {({ getRootProps, getInputProps }) => (
                            <section className="dropzone-container">
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p>Kéo và thả hình ảnh hoặc nhấp để chọn hình ảnh</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
                <div className='showimages d-flex flex-wrap gap-3'>
                    {uploadState.map((i, j) => (
                        <div className='position-relative image-container' key={j}>
                            <button type='button' onClick={() => dispatch(deleteImage(i.public_id))} className='btn-close position-absolute' style={{ top: "5px", right: "5px" }}></button>
                            <img src={i.url} alt="no_image" width={200} height={200} className='image-preview'/>
                        </div>
                    ))}
                </div>
                <button type='submit' className='btn btn-success border-0 rounded-3'>
                    Thêm
                </button>
            </form>
        </div>
    );
}

export default AddProduct;
