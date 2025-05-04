import React from 'react';

const SuccessFailerAlert: React.FC<{
  message: string;
  type: 'success' | 'error' | 'canceled' | null;
}> = ({ message, type }) => (
  <div
    className={
      type === 'canceled'
        ? `z-50 inline-flex p-3 pl-6 justify-center items-center gap-10 rounded-md border border-l-8 border-orange-500 bg-orange-100 relative`
        : type === 'success'
          ? `z-50 inline-flex p-3 pl-6 justify-center items-center gap-10 rounded-md border border-l-8 border-green-600 bg-green-100 relative`
          : `z-50 inline-flex p-3 pl-6 justify-center items-center gap-10 rounded-md border border-l-8 border-red-500 bg-red-100 relative`
    }
    role="alert"
  >
    <span className="block sm:inline text-gray-800 font-inter font-normal text-md">
      {message}
    </span>
  </div>
);

export default SuccessFailerAlert;
