'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
                    <div className="mb-4">
                        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            משהו השתבש
                        </h3>
                        <p className="text-gray-600 mb-4 max-w-sm">
                            אירעה שגיאה בלתי צפויה. אנא נסה שוב או צור קשר עם התמיכה.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={this.handleRetry} variant="outline">
                            נסה שוב
                        </Button>
                        <Button onClick={() => window.location.reload()}>
                            רענן דף
                        </Button>
                    </div>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className="mt-4 text-left max-w-md">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                פרטי שגיאה (למפתחים)
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook for functional components
export function useErrorHandler() {
    return (error: Error) => {
        console.error('Error caught by useErrorHandler:', error);
        // In a real app, you might want to send this to an error reporting service
    };
}

// Specialized error boundaries for different contexts
export function BuilderErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary
            fallback={
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        בעיה בבניית הסלט
                    </h3>
                    <p className="text-gray-600 mb-4">
                        לא הצלחנו לטעון את בונה הסלט. אנא נסה שוב.
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        התחל מחדש
                    </Button>
                </div>
            }
        >
            {children}
        </ErrorBoundary>
    );
}

export function NutritionErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary
            fallback={
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-600">
                        לא ניתן לחשב ערכים תזונתיים כרגע
                    </p>
                </div>
            }
        >
            {children}
        </ErrorBoundary>
    );
}
