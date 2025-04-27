import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
    options,
    defaultOption,
    onChange,
    placeholder = "Select Status",
    disabled = false,
    width = "100%"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    // Don't initialize with defaultOption, only track selections made by the user
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleOptionClick = (event, option) => {
        // Prevent the default action (form submission)
        event.preventDefault();
        event.stopPropagation();

        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) {
            onChange(event, option);
        }
    };

    // Base styles
    const styles = {
        container: {
            position: 'relative',
            width: width,
            fontFamily: 'sans-serif'
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 16px',
            textAlign: 'left',
            backgroundColor: disabled ? '#f3f4f6' : 'white',
            color: disabled ? '#6b7280' : 'black',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none'
        },
        buttonHover: {
            backgroundColor: '#f9fafb'
        },
        optionText: {
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        dropdownList: {
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            marginTop: '4px',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            maxHeight: '240px',
            overflowY: 'auto'
        },
        optionList: {
            padding: '4px 0',
            margin: 0,
            listStyle: 'none'
        },
        option: {
            position: 'relative',
            padding: '8px 12px',
            paddingRight: '36px',
            cursor: 'pointer',
            userSelect: 'none',
            color: '#1f2937'
        },
        optionSelected: {
            backgroundColor: '#eff6ff',
            color: '#1d4ed8'
        },
        optionHover: {
            backgroundColor: '#dbeafe'
        },
        checkmark: {
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#2563eb'
        },
        chevron: {
            width: '20px',
            height: '20px',
            marginLeft: '8px',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
        }
    };

    return (
        <div
            style={styles.container}
            ref={dropdownRef}
            name="status"
        >
            <button
                type="button"
                style={styles.button}
                onClick={handleToggleDropdown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
                name="status"
                data-id="status-input"
            >
                <span style={styles.optionText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    style={styles.chevron}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    style={styles.dropdownList}
                    role="listbox"
                >
                    <ul style={styles.optionList}>
                        {options.map((option, index) => {
                            const isSelected = selectedOption && selectedOption.value === option.value;

                            return (
                                <li
                                    key={option.value}
                                    style={{
                                        ...styles.option,
                                        ...(isSelected ? styles.optionSelected : {}),
                                    }}
                                    data-name="status"
                                    data-id="status-input"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={(e) => handleOptionClick(e, option)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.optionHover.backgroundColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = isSelected
                                            ? styles.optionSelected.backgroundColor
                                            : 'transparent';
                                    }}
                                >
                                    <span name="status" style={styles.optionText}>{option.label}</span>
                                    {isSelected && (
                                        <span style={styles.checkmark}>
                                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;