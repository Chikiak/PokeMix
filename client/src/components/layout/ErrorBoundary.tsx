import { Component, type ReactNode, type ErrorInfo } from 'react';
import ErrorMessage from "../common/ErrorMessage.tsx";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        errorMessage: '',
    };

    public static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            errorMessage: error.message,
        };
    };
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    public render() {
        if (this.state.hasError) {
            return <ErrorMessage message={`Unexpected error: ${this.state.errorMessage}`}/>
        }
        return this.props.children;
    };
}

export default ErrorBoundary;