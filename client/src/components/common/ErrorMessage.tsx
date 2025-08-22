import React from "react";
import './ErrorMessage.css';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="error-message-container" role="alert">
            <p className="error-message-text">⚠️ {message}</p>
        </div>
    )
}

export default ErrorMessage;