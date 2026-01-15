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
    return (
        <div className="p-8 space-x-3">
            <h1 className="text-2xl font-bold">Demo</h1>
            <Button onClick={handleBackgroundAPI} disabled={loading}>Background API</Button>
            {loading && <Spinner />}
        </div>
    )
}

export default DemoPage;