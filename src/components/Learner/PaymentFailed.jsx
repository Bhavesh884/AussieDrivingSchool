import { AiOutlineCloseCircle } from "react-icons/ai";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-200 via-red-100 to-red-50 p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 lg:p-12 max-w-3xl w-full text-center">
        <div className="flex justify-center mb-6 animate-bounce">
          <AiOutlineCloseCircle className="w-20 h-20 text-red-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
          Payment Failed!
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Unfortunately, your transaction could not be completed. Please check
          your payment details or try again later. We apologize for the
          inconvenience.
        </p>

        <button
          onClick={() => {
            // setIsFailureModalOpen(false);
            navigate("/paymentpage"); // Redirect to the payment page for retry
          }}
          className="mt-6 px-6 py-3 bg-red-500 text-white rounded-full font-medium text-lg shadow-lg transform transition hover:scale-105 hover:bg-red-600"
        >
          Retry Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;
