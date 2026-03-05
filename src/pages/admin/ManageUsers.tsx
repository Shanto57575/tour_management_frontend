import { useState } from "react";
import { useGetAllUsersQuery, useUpdateUserMutation } from "@/redux/features/user/user.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, UserIcon, ShieldCheckIcon, ShieldXIcon } from "lucide-react";
import FullPageLoader from "@/utils/FullPageLoader";
import Pagination from "@/utils/Pagination";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { IUser } from "@/types/auth.type";

export const ManageUsers = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const { data: usersResponse, isLoading } = useGetAllUsersQuery({
        page,
        limit: 10,
        searchTerm: searchTerm || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
    });

    const [updateUser] = useUpdateUserMutation();

    const handleUpdate = async (userId: string, dataKey: string, dataValue: string | boolean) => {
        const toastId = toast.loading("Updating user...");
        try {
            const formData = new FormData();
            formData.append("data", JSON.stringify({ [dataKey]: dataValue }));
            const directFormData = new FormData();
            directFormData.append(dataKey, String(dataValue));

            const res = await updateUser({ userId, userInfo: directFormData }).unwrap();
            if ((res as any)?.success || res) {
                toast.success(`User updated successfully`, { id: toastId });
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data?.message || "Failed to update user", { id: toastId });
        }
    };

    const handleChangeRole = (userId: string, newRole: string) => {
        handleUpdate(userId, "role", newRole);
    };

    const handleToggleStatus = (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
        handleUpdate(userId, "isActive", newStatus);
    };

    const handleToggleVerified = (userId: string, currentVerified: boolean) => {
        handleUpdate(userId, "isVerified", !currentVerified);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20 min-h-[60vh] items-center">
                <FullPageLoader />
            </div>
        );
    }

    const users = usersResponse?.data?.users || [];
    const meta = usersResponse?.data?.meta || { page: 1, totalPage: 1 };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold tracking-tight font-serif text-gray-900 dark:text-white">
                    Manage Users
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                        placeholder="Search users by name or email..."
                        className="pl-10 border-gray-200 dark:border-gray-800 focus:ring-purple-500"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setPage(1); }}>
                    <SelectTrigger className="w-full md:w-[180px] border-gray-200 dark:border-gray-800">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="GUIDE">Guide</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                {users.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                        No Users found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">User</TableHead>
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Email</TableHead>
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Role</TableHead>
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">Active</TableHead>
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">Verified Guide</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user: IUser) => (
                                    <TableRow key={user._id} className="border-b dark:bg-slate-950 border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-x-3">
                                                <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex flex-shrink-0 items-center justify-center overflow-hidden border border-purple-200 dark:border-purple-800">
                                                    {user.picture ? (
                                                        <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon size={18} />
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-400">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={user.role}
                                                onValueChange={(val) => handleChangeRole(user._id, val)}
                                                disabled={user.role === "SUPER_ADMIN"} // Avoid editing super admins
                                            >
                                                <SelectTrigger className={`w-[130px] h-8 text-xs font-medium border-transparent focus:ring-0 focus:ring-offset-0 ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    user.role === 'GUIDE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                        user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                    }`}>
                                                    <SelectValue placeholder="Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="USER">User</SelectItem>
                                                    <SelectItem value="GUIDE">Guide</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleToggleStatus(user._id, user.isActive as string)}
                                                disabled={user.role === "SUPER_ADMIN"}
                                                className={`h-8 px-2 rounded-full font-medium ${user.isActive === "ACTIVE"
                                                    ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                                                    : "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                    }`}
                                            >
                                                {user.isActive === "ACTIVE" ? "Active" : "Blocked"}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                disabled={user.role !== "GUIDE" && user.role !== "ADMIN"}
                                                onClick={() => handleToggleVerified(user._id, user.isVerified)}
                                                className={`w-8 h-8 rounded-full ${user.isVerified
                                                    ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                                                    : "text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800"
                                                    }`}
                                                title={user.isVerified ? "Verified Guide" : "Not Verified"}
                                            >
                                                {user.isVerified ? <ShieldCheckIcon size={18} /> : <ShieldXIcon size={18} />}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPage}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </div>
        </div>
    );
};
