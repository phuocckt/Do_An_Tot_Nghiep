import React from 'react'
import CustomerInput from '../Components/CustomerInput';

function AddColor() {
    return (
        <div>
            <h3 className='mb-4 title'>Add Color</h3>
            <div className=''>
                <form action=''>
                    <CustomerInput type="color" label="Enter Color Title" />
                    <button className='btn btn-success border-0 -rounded-3 my-5'>Add</button>
                </form>
            </div>
        </div>
    )
}

export default AddColor;
