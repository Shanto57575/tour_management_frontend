import { useState } from "react";
import { toast } from "sonner";
import {
    SearchIcon,
    CheckCircle,
    XCircle,
    EyeIcon,
    Clock,
    User,
    ShieldCheck,
    ShieldAlert,
} from "lucide-react";
import {
    useGetAllApplicationsQuery,
    useUpdateApplicationStatusMutation,
    type IGuideApplication,
} from "@/redux/features/guide/guide.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import FullPageLoader from "@/utils/FullPageLoader";
import Pagination from "@/utils/Pagination";

export function ManageGuides() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [rejectDialog, setRejectDialog] = useState<{ open: boolean; appId: string }>({ open: false, appId: "" });
    const [rejectionReason, setRejectionReason] = useState("");

    const { data, isLoading } = useGetAllApplicationsQuery({
        page,
        limit: 10,
        searchTerm: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
    });

    const [updateStatus] = useUpdateApplicationStatusMutation();

    const handleStatusChange = async (id: string, newStatus: string) => {
        if (newStatus === "REJECTED") {
            setRejectDialog({ open: true, appId: id });
            setRejectionReason("");
            return;
        }

        const confirmMsg = "Are you sure you want to approve this application? The user will be promoted to Guide role.";
        if (!window.confirm(confirmMsg)) return;

        await submitStatusChange(id, newStatus);
    };

    const submitStatusChange = async (id: string, status: string, reason?: string) => {
        const toastId = toast.loading("Updating status...");
        try {
            const res = await updateStatus({
                id,
                status,
                rejectionReason: reason,
            }).unwrap();

            if (res.success) {
                toast.success(`Application marked as ${status}`, { id: toastId });
                setRejectDialog({ open: false, appId: "" });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update status", {
                id: toastId,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <FullPageLoader />
            </div>
        );
    }

    const applications = data?.data || [];
    const meta = data?.meta || { page: 1, totalPage: 1 };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Manage Guide Applications
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Review applicant identities and approve them for Guide access.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="relative flex-1">
                    <SearchIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                    />
                    <Input
                        placeholder="Search by name, email, or division..."
                        className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(val) => {
                        setStatusFilter(val);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-full md:w-[220px] h-11 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        <SelectItem value="PENDING">Pending Approval</SelectItem>
                        <SelectItem value="APPROVED">Approved Guides</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-32 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                    <ShieldAlert className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        No applications found
                    </h3>
                    <p className="text-zinc-500 max-w-sm mt-1">
                        We couldn't find any guide applications matching your current filters.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-600 dark:text-zinc-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                        Applicant
                                    </th>
                                    <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                        Preferred Division
                                    </th>
                                    <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                        NID Document
                                    </th>
                                    <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {applications.map((app: IGuideApplication) => (
                                    <tr
                                        key={app._id}
                                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                                                    {app.user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {app.user?.name || "Unknown User"}
                                                    </div>
                                                    <div className="text-xs text-zinc-500">
                                                        {app.user?.email || "No email"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300">
                                            {app.division?.name || "N/A"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedImage(app.nidPhoto)}
                                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                                            >
                                                <EyeIcon size={16} className="mr-2" />
                                                View NID
                                            </Button>
                                        </td>

                                        <td className="px-6 py-4">
                                            {app.status === "PENDING" && (
                                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900">
                                                    <Clock size={12} className="mr-1" /> Pending
                                                </Badge>
                                            )}
                                            {app.status === "APPROVED" && (
                                                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900">
                                                    <ShieldCheck size={12} className="mr-1" /> Approved
                                                </Badge>
                                            )}
                                            {app.status === "REJECTED" && (
                                                <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900">
                                                    <XCircle size={12} className="mr-1" /> Rejected
                                                </Badge>
                                            )}
                                            {app.status === "ARCHIVED" && (
                                                <Badge variant="outline" className="bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">
                                                    Archived
                                                </Badge>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            {app.status === "PENDING" ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={() => handleStatusChange(app._id, "APPROVED")}
                                                    >
                                                        <CheckCircle size={16} className="mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleStatusChange(app._id, "REJECTED")}
                                                    >
                                                        <XCircle size={16} className="mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-zinc-400 italic">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {meta.totalPage > 1 && (
                <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPage}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            )}

            {/* Image Modal */}
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-4xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle>Applicant Identity Document (NID)</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 flex justify-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-2 min-h-[300px]">
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt="NID Document"
                                className="max-h-[70vh] w-auto object-contain rounded-md"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectDialog.open} onOpenChange={(open) => !open && setRejectDialog({ open: false, appId: "" })}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div>
                            <label className="text-sm font-medium mb-2">Rejection Reason</label>
                            <Input
                                placeholder="e.g. Blurry photo, mismatched IDs..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialog({ open: false, appId: "" })}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => submitStatusChange(rejectDialog.appId, "REJECTED", rejectionReason)}
                            disabled={!rejectionReason.trim()}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
