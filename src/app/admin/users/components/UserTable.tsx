
'use client';

import { SessionProvider } from "@/hooks/use-session";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import type { UserData } from "@/lib/actions/user-actions";

interface UserTableProps {
    users: UserData[];
}

export function UserTable({ users }: UserTableProps) {
    return (
        <SessionProvider>
            <DataTable columns={columns} data={users} />
        </SessionProvider>
    )
}
