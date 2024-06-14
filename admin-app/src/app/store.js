import { configureStore } from "@reduxjs/toolkit"; 
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customer/customerSlice";
import productReducer from "../features/product/productSlice";
import brandReducer from "../features/brand/brandSlice";
import categoryReducer from "../features/category/categorySlice";
import colorReducer from "../features/color/colorSlice";
import sizeReducer from "../features/size/sizeSlice";
import orderReducer from "../features/order/orderSlice";

export const store = configureStore({
    reducer: { auth: authReducer, 
                customer: customerReducer, 
                product: productReducer, 
                brand: brandReducer, 
                category: categoryReducer, 
                color: colorReducer, 
                size: sizeReducer,
                order: orderReducer
            },
});