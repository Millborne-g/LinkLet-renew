import React from "react";

const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center h-screen z-50 bg-black/50 fixed top-0 left-0 right-0 bottom-0">
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
