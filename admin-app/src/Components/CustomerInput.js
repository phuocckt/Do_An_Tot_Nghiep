import React from 'react';
import { MDBInput } from 'mdb-react-ui-kit';

const CustomerInput = (props) => {
    const { type, label, i_id, i_class, name, value, onChange, onBlur, size } = props;
    return (
        <div className="form-floating mb-3">
            <MDBInput  
                type={type} 
                className={`form-control ${i_class}`} 
                id={i_id} 
                placeholder={label} 
                name={name} 
                value={value} 
                onChange={onChange} 
                size={size}/>
        </div>
    );
}

export default CustomerInput;
