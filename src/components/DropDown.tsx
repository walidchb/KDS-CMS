import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { GoChevronDown } from "react-icons/go";

interface DropdownProps<T> {
  items: T[];
  value: T | null;
  setValue: (val: T | null) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

function Dropdown<T extends string | number>({
  items,
  value,
  setValue,
  onClear,
  placeholder,
  className,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: T) => {
    setValue(item);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(null);
    onClear?.();
  };

  // useEffect(() => {
  //   console.log("value", value);
  // }, [value]);

  return (
    <div className={`relative ${className}`}>
      <button
        className={`w-full py-2 px-4 flex    justify-between items-center border-[0.5px] border-gray-200 rounded-full ${
          value ? "bg-red-500 text-white" : "bg-white text-gray-500"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value ?? placeholder}
        {value ? (
          <AiOutlineClose className="text-white" onClick={handleClear} />
        ) : (
          <GoChevronDown />
        )}
      </button>
      {isOpen && (
        <ul
          style={{ zIndex: 700 }}
          className="absolute overflow-hidden left-0 w-full mt-1 bg-white text-gray-600 border-[0.5px] border-gray-200 rounded-2xl shadow-md z-10"
        >
          {items.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
