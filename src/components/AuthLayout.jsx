// src/components/AuthLayout.jsx
import logoImage from "../assets/logo.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#dff0f7] flex items-center justify-center p-4">
      {/* Card container */}
      <div className="relative flex w-full max-w-3xl min-h-[520px]">
        {/* Left panel - logo */}
        <div className="w-[46%] bg-[#7ecfe0] rounded-3xl flex items-center justify-center shadow-lg z-10 p-8">
         
            <img 
              src={logoImage} 
              alt="WashUp Logo" 
              className="w-72 h-72 object-contain scale-125"
            />
            
        </div>

        {/* Right panel - form */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl ml-[-30px] z-20 flex flex-col justify-center px-10 py-10">
          {children}
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-5 right-6 w-9 h-9 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
      >
        ←
      </button>
    </div>
  );
};

export default AuthLayout;