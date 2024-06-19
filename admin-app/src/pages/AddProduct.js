import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomerInput from '../Components/CustomerInput';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getBrands } from '../features/brand/brandSlice';
import { getCategories } from '../features/category/categorySlice';
import { getSizes } from '../features/size/sizeSlice';
import { Select } from 'antd';
import 'react-widgets/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropzone from 'react-dropzone';
import { deleteImage, uploadImage } from '../features/upload/uploadSlice';
import { createProduct } from '../features/product/productSlice';
import Swal from 'sweetalert2';

const { Option } = Select;

const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    priceOld: yup.number()
        .typeError('Price must be a number')
        .positive('Price must be a positive number')
        .integer('Price must be an integer'),
    price: yup.number()
        .required('Price is required')
        .typeError('Price must be a number')
        .positive('Price must be a positive number')
        .integer('Price must be an integer'),
    brand: yup.string().required('Brand is required'),
    category: yup.string().required('Category is required'),
    variants: yup.array().of(
        yup.object().shape({
            size: yup.string().required('Size is required'),
            quantity: yup.number()
                .required('Quantity is required')
                .typeError('Quantity must be a number')
                .positive('Quantity must be a positive number')
                .integer('Quantity must be an integer')
        })
    ).min(1, 'At least one variant is required').required('Variants are required'),
    image: yup.array().min(1, 'Image is required').required('Image is required'),
    quantity: yup.number()
        .typeError('Quantity must be a number')
        .positive('Quantity must be a positive number')
        .integer('Quantity must be an integer')
        .required('Total quantity is required')
});

function AddProduct() {
    const dispatch = useDispatch();
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        dispatch(getBrands());
        dispatch(getCategories());
        dispatch(getSizes());
    }, [dispatch]);

    const brandState = useSelector((state) => state.brand.brands);
    const categoryState = useSelector((state) => state.category.categories);
    const sizeState = useSelector((state) => state.size.sizes);
    const uploadState = useSelector((state) => state.upload.images);

    const sizes = sizeState.map(i => ({
        _id: i._id,
        size: i.title
    }));

    const images = uploadState.map(i => ({
        public_id: i.public_id,
        url: i.url
    }));

    useEffect(() => {
        formik.values.image = images;
    }, [images]);

    const handleAddVariant = () => {
        const newVariants = [...variants, { size: '', quantity: '' }];
        setVariants(newVariants);
        formik.setFieldValue('variants', newVariants);
        updateTotalQuantity(newVariants);
    };

    const handleRemoveVariant = (index) => {
        const updatedVariants = variants.filter((_, idx) => idx !== index);
        setVariants(updatedVariants);
        formik.setFieldValue('variants', updatedVariants);
        updateTotalQuantity(updatedVariants);
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = variants.map((variant, idx) => 
            idx === index ? { ...variant, [field]: value } : variant
        );
        setVariants(updatedVariants);
        formik.setFieldValue('variants', updatedVariants);
        updateTotalQuantity(updatedVariants);
    };

    const updateTotalQuantity = (updatedVariants) => {
        const totalQuantity = updatedVariants.reduce((total, variant) => total + Number(variant.quantity || 0), 0);
        formik.setFieldValue('quantity', totalQuantity);
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            priceOld: '',
            price: '',
            brand: '',
            category: '',
            variants: [],
            image: [],
            quantity: 0
        },
        validationSchema: schema,
        onSubmit: values => {
            dispatch(createProduct(values));
        },
    });

    useEffect(() => {
        if (formik.values.variants !== variants) {
            setVariants(formik.values.variants);
        }
    }, [formik.values.variants]);
    
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
        <div>
            <h3 className='mb-4 title'>Thêm sản phẩm</h3>
            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <CustomerInput
                            type="text"
                            value={formik.values.title}
                            label="Nhập tên sản phẩm"
                            name="title"
                            onChange={formik.handleChange("title")}
                        />
                        {formik.touched.title && formik.errors.title ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.title}</p>
                        ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <CustomerInput
                            type="number"
                            value={formik.values.priceOld}
                            label="Giá gốc"
                            name="priceOld"
                            onChange={formik.handleChange("priceOld")}
                        />
                        {formik.touched.priceOld && formik.errors.priceOld ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.priceOld}</p>
                        ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <CustomerInput
                            type="number"
                            value={formik.values.price}
                            label="Giá khuyến mãi"
                            name="price"
                            onChange={formik.handleChange("price")}
                        />
                        {formik.touched.price && formik.errors.price ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.price}</p>
                        ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <Select
                            name='brand'
                            className='form-control'
                            value={formik.values.brand}
                            onChange={(value) => formik.setFieldValue('brand', value)}
                        >
                            <Option value="" disabled hidden>Chọn thương hiệu</Option>
                            {brandState.map((i, j) => (
                                <Option key={j} value={i._id}>
                                    {i.title}
                                </Option>
                            ))}
                        </Select>
                        {formik.touched.brand && formik.errors.brand ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.brand}</p>
                        ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <Select
                            name='category'
                            className='form-control'
                            value={formik.values.category}
                            onChange={(value) => formik.setFieldValue('category', value)}
                        >
                            <Option value="" disabled hidden>Chọn loại sản phẩm</Option>
                            {categoryState.map((i, j) => (
                                <Option key={j} value={i._id}>
                                    {i.title}
                                </Option>
                            ))}
                        </Select>
                        {formik.touched.category && formik.errors.category ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.category}</p>
                        ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <CustomerInput
                            type="number"
                            value={formik.values.quantity}
                            label="Tổng số lượng"
                            name="quantity"
                            readOnly
                        />
                        {formik.touched.quantity && formik.errors.quantity ? (
                            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.quantity}</p>
                        ) : null}
                    </div>
                </div>
                <div>
                    <button type="button" className="btn btn-primary mb-3" onClick={handleAddVariant}>
                        Thêm biến thể
                    </button>
                </div>
                {variants.map((variant, index) => (
                    <div key={index} className="row mb-3">
                        <div className="col-md-3">
                            <Select
                                value={variant.size}
                                onChange={(value) => handleVariantChange(index, 'size', value)}
                                className="form-control"
                            >
                                <Option value="" disabled hidden>Chọn kích thước</Option>
                                {sizes.map((size, idx) => (
                                    <Option key={idx} value={size._id}>
                                        {size.size}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="col-md-3">
                            <CustomerInput
                                type="number"
                                value={variant.quantity}
                                label="Số lượng"
                                name={`variants[${index}].quantity`}
                                onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <button type="button" className="btn btn-danger mt-4" onClick={() => handleRemoveVariant(index)}>
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
                <div className="mb-3">
                    <label htmlFor="description">Mô tả</label>
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
