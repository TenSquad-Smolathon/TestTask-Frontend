import { useState, useRef, useEffect } from 'react';
import '../static/styles/Dropdown.css'; // We'll create this next

const Dropdown = ({
    options = [],
    value = "Dropdown",
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div>
            <div onClick={() => setIsOpen(!isOpen)} className={`dropdown-container ${className}`} ref={dropdownRef}>
                <span className="dropdown-selected">
                    {value}
                </span>
                <div className={`dropdown-indicator${isOpen ? "-opened" : ""}`}>▼</div>
            </div>

            {isOpen && (
                <div className="dropdown-menu">
                    {options}
                </div>
            )}
        </div>
    );
};

export default Dropdown;