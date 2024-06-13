import CustomerInput from '../Components/CustomerInput';

const Forgotpassword = () => {
  return (
    <div className="py-5" style={{ background: "#ffd333",minHeight:"100vh" }}>
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className='text-center title'>Forgot Password</h3>
        <form action=''>
          <CustomerInput type="text" label="Email Address" id="email" />
          <button className='border-0 px-3 py-2 text-white fw-bold w-100' style={{ background: '#ffd333' }} type='submit'>Send Link</button>
        </form>
      </div>
    </div>
  )
}

export default Forgotpassword;
