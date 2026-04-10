import React, { useRef, useEffect } from 'react';
import { Input } from 'antd';

const OTPInput = ({ length = 6, value = '', onChange }) => {
    const inputs = useRef([]);

    // Initialize inputs array
    useEffect(() => {
        inputs.current = inputs.current.slice(0, length);
    }, [length]);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return; // Only allow digits

        const newOtp = value.split('');
        // Take only the last character if multiple are entered (e.g. from paste or fast typing)
        newOtp[index] = val.slice(-1);
        const combinedOtp = newOtp.join('');
        onChange(combinedOtp);

        // Move focus to next input if value is entered
        if (val && index < length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
                // Move focus to previous input if current is empty
                inputs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, length);
        if (!/^\d+$/.test(data)) return;

        onChange(data);
        // Focus the last input or the one after the pasted data
        const focusIndex = Math.min(data.length, length - 1);
        inputs.current[focusIndex].focus();
    };

    return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {Array.from({ length }).map((_, index) => (
                <Input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    style={{
                        width: '40px',
                        height: '48px',
                        fontSize: '18px',
                        textAlign: 'center',
                        borderRadius: '8px',
                        padding: 0
                    }}
                />
            ))}
        </div>
    );
};

export default OTPInput;
