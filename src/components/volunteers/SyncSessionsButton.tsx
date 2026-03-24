"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { syncAutomaticSessionsAction } from "@/app/actions/sessions";
import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function SyncSessionsButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSync() {
        setLoading(true);
        const res = await syncAutomaticSessionsAction();
        if (res.success) {
            router.refresh();
        } else {
            alert("Failed to sync sessions");
        }
        setLoading(false);
    }

    return (
        <Button 
            onClick={handleSync} 
            disabled={loading} 
            variant="outline"
            size="sm"
            className="h-9"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Sync Recurring Sessions
        </Button>
    );
}
