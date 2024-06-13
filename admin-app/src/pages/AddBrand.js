import React from 'react'
import CustomerInput from '../Components/CustomerInput';

function AddBrand() {
    return (
        <div>
            <h3 className='mb-4 title'>Add Brand</h3>
            <div className=''>
                <form action=''>
                    <CustomerInput type="text" label="Enter Brand Title" />
                    <button className='btn btn-success border-0 -rounded-3 my-5'>Add</button>
                </form>
            </div>
        </div>
    )
}

export default AddBrand;
