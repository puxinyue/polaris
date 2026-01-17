"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

const DemoPage = () => {
    const [loading, setLoading] = useState(false);
    const handleBackgroundAPI = async () => {
        setLoading(true);
        const response = await fetch('/api/demo/background', {
            method: 'POST',
        });
        const data = await response.json();
        console.log(data.message);
        setLoading(false);
    }
    
    const handleAPIError = async () => {
        setLoading(true);
        const response = await fetch('/api/demo/api-error', {
            method: 'POST',
        });
        const data = await response.json();
        console.log(data.message);
        setLoading(false);
    }
    const handleFunctionError = async () => {
        throw new Error('Function error');
    }

    return (
        <div className="p-8 space-x-3">
            <h1 className="text-2xl font-bold">Demo</h1>
            <Button onClick={handleBackgroundAPI} disabled={loading}>Background API</Button>
            {loading && <Spinner />}
            <Button onClick={handleAPIError} disabled={loading}>API Error</Button>
            <Button onClick={handleFunctionError} disabled={loading}>Function Error</Button>
        </div>
    )
}

export default DemoPage;