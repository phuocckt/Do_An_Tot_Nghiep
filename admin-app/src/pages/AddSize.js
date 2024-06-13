import React from 'react'
import CustomerInput from '../Components/CustomerInput';

function AddSize() {
    return (
        <div>
            <h3 className='mb-4 title'>Add Size</h3>
            <div className=''>
                <form action=''>
                    <CustomerInput type="text" label="Enter Size Title" />
                    <button className='btn btn-success border-0 -rounded-3 my-5'>Add</button>
                </form>
            </div>
        </div>
    )
}

export default AddSize;
