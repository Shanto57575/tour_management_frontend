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
    Loader2,
    Power,
} from "lucide-react";
import {
    useGetAllApplicationsQuery,
    useToggleGuideActivationMutation,
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
import DeleteConfirmation from "@/components/DeleteConfirmation";

export function ManageGuides() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedApplication, setSelectedApplication] = useState<IGuideApplication | null>(null);
    const [selectedHistoryApplication, setSelectedHistoryApplication] = useState<IGuideApplication | null>(null);
    const [rejectDialog, setRejectDialog] = useState<{ open: boolean; appId: string }>({ open: false, appId: "" });
    const [approveDialog, setApproveDialog] = useState<{ open: boolean; appId: string }>({ open: false, appId: "" });
    const [rejectionReason, setRejectionReason] = useState("");

    const { data, isLoading } = useGetAllApplicationsQuery({
        page,
        limit: 10,
        searchTerm: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
    });

    const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateApplicationStatusMutation();
    const [toggleGuideActivation, { isLoading: isActivationUpdating }] = useToggleGuideActivationMutation();

    const formatOptionalValue = (value?: string | number | null) => {
        if (value === undefined || value === null) return "Not provided";
        const formatted = String(value).trim();
        return formatted.length > 0 ? formatted : "Not provided";
    };

    const formatListValue = (items?: string[]) => {
        if (!items || items.length === 0) return "Not provided";
        return items.join(", ");
    };

    const toSafeTimestamp = (value?: string) => {
        if (!value) return 0;
        const parsed = new Date(value).getTime();
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const getStatusTimeline = (application?: IGuideApplication | null) => {
        if (!application?.statusHistory?.length) return [];
        return [...application.statusHistory].sort(
            (a, b) => toSafeTimestamp(a.changedAt) - toSafeTimestamp(b.changedAt),
        );
    };

    const getRejectionEntries = (application?: IGuideApplication | null) => {
        return getStatusTimeline(application).filter((entry) => entry.status === "REJECTED");
    };

    const getChangedByDisplay = (changedBy: IGuideApplication["statusHistory"][number]["changedBy"]) => {
        if (typeof changedBy === "string") return changedBy;
        if (changedBy?.name) return changedBy.name;
        if (changedBy?.email) return changedBy.email;
        return changedBy?._id || "Unknown";
    };

    const handleStatusChange = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
        if (newStatus === "REJECTED") {
            setRejectDialog({ open: true, appId: id });
            setRejectionReason("");
            return;
        }

        setApproveDialog({ open: true, appId: id });
    };

    const handleApproveConfirm = async () => {
        if (!approveDialog.appId) return;
        const isSuccess = await submitStatusChange(approveDialog.appId, "APPROVED");
        if (isSuccess) {
            setApproveDialog({ open: false, appId: "" });
        }
    };

    const submitStatusChange = async (id: string, status: "APPROVED" | "REJECTED", reason?: string) => {
        const toastId = toast.loading("Updating status...");
        try {
            const res = await updateStatus({
                id,
                status,
                reason,
            }).unwrap();

            if (res.success) {
                toast.success(`Application marked as ${status}`, { id: toastId });
                setRejectDialog({ open: false, appId: "" });
                setRejectionReason("");
                return true;
            }

            toast.error("Failed to update status", { id: toastId });
            return false;
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "data" in error &&
                    typeof (error as { data?: { message?: string } }).data?.message === "string"
                    ? (error as { data?: { message?: string } }).data?.message
                    : "Failed to update status";

            toast.error(message, {
                id: toastId,
            });
            return false;
        }
    };

    const handleGuideActivationToggle = async (application: IGuideApplication) => {
        if (application.status !== "APPROVED") return;

        const currentIsActive = application.guideProfile?.isActive ?? true;
        const nextIsActive = !currentIsActive;
        const toastId = toast.loading(`${nextIsActive ? "Activating" : "Deactivating"} guide...`);

        try {
            const res = await toggleGuideActivation({
                id: application._id,
                isActive: nextIsActive,
            }).unwrap();

            if (res.success) {
                toast.success(
                    `Guide ${nextIsActive ? "activated" : "deactivated"} successfully`,
                    { id: toastId },
                );
                return;
            }

            toast.error("Failed to update guide activation", { id: toastId });
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "data" in error &&
                    typeof (error as { data?: { message?: string } }).data?.message === "string"
                    ? (error as { data?: { message?: string } }).data?.message
                    : "Failed to update guide activation";

            toast.error(message, { id: toastId });
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
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 overflow-x-hidden">
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
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {applications.map((app: IGuideApplication) => (
                            <div
                                key={app._id}
                                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                                            {app.user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                                {app.user?.name || "Unknown User"}
                                            </p>
                                            <p className="text-xs text-zinc-500 truncate">
                                                {app.user?.email || "No email"}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                        {app.division?.name || "N/A"}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {app.status === "PENDING" && (
                                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900">
                                            <Clock size={12} className="mr-1" /> Pending
                                        </Badge>
                                    )}
                                    {app.status === "APPROVED" && (
                                        <>
                                            <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900">
                                                <ShieldCheck size={12} className="mr-1" /> Approved
                                            </Badge>
                                            <Badge variant="outline" className={app.guideProfile?.isActive === false
                                                ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900"
                                                : "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"}>
                                                {app.guideProfile?.isActive === false ? "Inactive" : "Active"}
                                            </Badge>
                                        </>
                                    )}
                                    {app.status === "REJECTED" && (
                                        <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900">
                                            <XCircle size={12} className="mr-1" /> Rejected
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedApplication(app)}
                                        className="cursor-pointer"
                                    >
                                        <EyeIcon size={16} className="mr-2" />
                                        Details
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedHistoryApplication(app)}
                                        className="cursor-pointer"
                                    >
                                        <Clock size={16} className="mr-2" />
                                        History
                                    </Button>

                                    {app.status === "PENDING" ? (
                                        <>
                                            <Button
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => handleStatusChange(app._id, "APPROVED")}
                                                disabled={isStatusUpdating}
                                            >
                                                {isStatusUpdating ? (
                                                    <Loader2 size={16} className="mr-1 animate-spin" />
                                                ) : (
                                                    <CheckCircle size={16} className="mr-1" />
                                                )}
                                                {isStatusUpdating ? "Updating..." : "Approve"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleStatusChange(app._id, "REJECTED")}
                                                disabled={isStatusUpdating}
                                            >
                                                <XCircle size={16} className="mr-1" />
                                                Reject
                                            </Button>
                                        </>
                                    ) : app.status === "APPROVED" ? (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleGuideActivationToggle(app)}
                                            disabled={isActivationUpdating}
                                            className={`cursor-pointer h-8 px-3 rounded-full font-semibold border ${app.guideProfile?.isActive === false
                                                ? "text-rose-700 border-rose-200 bg-rose-50 hover:text-red-600 hover:bg-rose-100 dark:text-rose-300 dark:border-rose-800 dark:bg-rose-950/30 dark:hover:bg-rose-900/40"
                                                : "text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:text-purple-700 dark:text-purple-300 dark:border-purple-800 dark:bg-purple-950/30 dark:hover:bg-purple-900/40"
                                                }`}
                                        >
                                            {isActivationUpdating ? (
                                                <Loader2 size={15} className="mr-2 animate-spin" />
                                            ) : (
                                                <Power size={15} className="mr-2" />
                                            )}
                                            {app.guideProfile?.isActive === false ? "Activate Guide" : "Deactivate Guide"}
                                        </Button>
                                    ) : (
                                        <span className="text-xs text-zinc-400 italic">No actions</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-[980px] w-full text-sm text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-600 dark:text-zinc-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                            Applicant
                                        </th>
                                        <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                            Preferred Division
                                        </th>
                                        <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                            Documents
                                        </th>
                                        <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                            Current Status
                                        </th>
                                        <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                            Status History
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
                                                    onClick={() => setSelectedApplication(app)}
                                                    className="cursor-pointer text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                                                >
                                                    <EyeIcon size={16} className="mr-2" />
                                                    View Details
                                                </Button>
                                            </td>

                                            <td className="px-6 py-4">
                                                {app.status === "PENDING" && (
                                                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900">
                                                        <Clock size={12} className="mr-1" /> Pending
                                                    </Badge>
                                                )}
                                                {app.status === "APPROVED" && (
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900">
                                                            <ShieldCheck size={12} className="mr-1" /> Approved
                                                        </Badge>
                                                        <Badge variant="outline" className={app.guideProfile?.isActive === false
                                                            ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900"
                                                            : "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"}>
                                                            {app.guideProfile?.isActive === false ? "Inactive" : "Active"}
                                                        </Badge>
                                                    </div>
                                                )}
                                                {app.status === "REJECTED" && (
                                                    <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900">
                                                        <XCircle size={12} className="mr-1" /> Rejected
                                                    </Badge>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedHistoryApplication(app)}
                                                    className="cursor-pointer text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                                                >
                                                    <Clock size={16} className="mr-2" />
                                                    View Status History
                                                </Button>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {app.status === "PENDING" ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                            onClick={() => handleStatusChange(app._id, "APPROVED")}
                                                            disabled={isStatusUpdating}
                                                        >
                                                            {isStatusUpdating ? (
                                                                <Loader2 size={16} className="mr-1 animate-spin" />
                                                            ) : (
                                                                <CheckCircle size={16} className="mr-1" />
                                                            )}
                                                            {isStatusUpdating ? "Updating..." : "Approve"}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleStatusChange(app._id, "REJECTED")}
                                                            disabled={isStatusUpdating}
                                                        >
                                                            <XCircle size={16} className="mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                ) : app.status === "APPROVED" ? (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleGuideActivationToggle(app)}
                                                        disabled={isActivationUpdating}
                                                        className={`cursor-pointer h-8 px-3 rounded-full font-semibold border ${app.guideProfile?.isActive === false
                                                            ? "text-rose-700 border-rose-200 bg-rose-50 hover:text-red-600 hover:bg-rose-100 dark:text-rose-300 dark:border-rose-800 dark:bg-rose-950/30 dark:hover:bg-rose-900/40"
                                                            : "text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:text-purple-700 dark:text-purple-300 dark:border-purple-800 dark:bg-purple-950/30 dark:hover:bg-purple-900/40"
                                                            }`}
                                                    >
                                                        {isActivationUpdating ? (
                                                            <Loader2 size={15} className="mr-2 animate-spin" />
                                                        ) : (
                                                            <Power size={15} className="mr-2" />
                                                        )}
                                                        {app.guideProfile?.isActive === false ? "Activate Guide" : "Deactivate Guide"}
                                                    </Button>
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
                </>
            )}

            {/* Pagination */}
            {meta.totalPage > 1 && (
                <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPage}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            )}

            {/* Details Modal */}
            <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
                <DialogContent className="w-[95vw] md:max-w-2xl lg:max-w-4xl sm:w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Applicant</p>
                                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedApplication?.user?.name || "Unknown User"}</p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Email</p>
                                <p className="font-semibold text-zinc-900 dark:text-zinc-100 break-all">{selectedApplication?.user?.email || "No email"}</p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Current Status</p>
                                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedApplication?.status || "N/A"}</p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Submitted At</p>
                                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                    {selectedApplication?.submittedAt
                                        ? new Date(selectedApplication.submittedAt).toLocaleDateString()
                                        : "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                                <h4 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Personal Information</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-zinc-500">Date of Birth:</span> {selectedApplication?.dateOfBirth ? new Date(selectedApplication.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
                                    <p><span className="text-zinc-500">Gender:</span> {formatOptionalValue(selectedApplication?.gender)}</p>
                                    <p><span className="text-zinc-500">Phone:</span> {formatOptionalValue(selectedApplication?.phone)}</p>
                                    <p><span className="text-zinc-500">Alternate Phone:</span> {formatOptionalValue(selectedApplication?.alternatePhone)}</p>
                                    <p><span className="text-zinc-500">Present Address:</span> {formatOptionalValue(selectedApplication?.presentAddress)}</p>
                                    <p><span className="text-zinc-500">Permanent Address:</span> {formatOptionalValue(selectedApplication?.permanentAddress)}</p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                                <h4 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Identity and Location</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-zinc-500">NID Number:</span> {formatOptionalValue(selectedApplication?.nidNumber)}</p>
                                    <p><span className="text-zinc-500">Division:</span> {formatOptionalValue(selectedApplication?.division?.name)}</p>
                                    <p><span className="text-zinc-500">District:</span> {formatOptionalValue(selectedApplication?.district?.name)}</p>
                                    <p><span className="text-zinc-500">Operating Areas:</span> {formatListValue(selectedApplication?.operatingAreas)}</p>
                                    <p><span className="text-zinc-500">NID Verified:</span> {selectedApplication?.nidVerified ? "Yes" : "No"}</p>
                                    <p><span className="text-zinc-500">Resubmissions:</span> {selectedApplication?.resubmissionCount ?? 0}</p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                                <h4 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Professional Information</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-zinc-500">Languages:</span> {formatListValue(selectedApplication?.languages)}</p>
                                    <p><span className="text-zinc-500">Experience Years:</span> {formatOptionalValue(selectedApplication?.experienceYears)}</p>
                                    <p><span className="text-zinc-500">Specializations:</span> {formatListValue(selectedApplication?.specializations)}</p>
                                    <p><span className="text-zinc-500">Bio:</span> {formatOptionalValue(selectedApplication?.bio)}</p>
                                    <p><span className="text-zinc-500">License Number:</span> {formatOptionalValue(selectedApplication?.licenseNumber)}</p>
                                    <p><span className="text-zinc-500">License Verified:</span> {selectedApplication?.licenseVerified ? "Yes" : "No"}</p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                                <h4 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Payment and Emergency Contact</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-zinc-500">Bank Name:</span> {formatOptionalValue(selectedApplication?.bankName)}</p>
                                    <p><span className="text-zinc-500">Bank Account Number:</span> {formatOptionalValue(selectedApplication?.bankAccountNumber)}</p>
                                    <p><span className="text-zinc-500">Bank Branch:</span> {formatOptionalValue(selectedApplication?.bankBranchName)}</p>
                                    <p><span className="text-zinc-500">Bkash Number:</span> {formatOptionalValue(selectedApplication?.bkashNumber)}</p>
                                    <p><span className="text-zinc-500">Nagad Number:</span> {formatOptionalValue(selectedApplication?.nagadNumber)}</p>
                                    <p><span className="text-zinc-500">Emergency Name:</span> {formatOptionalValue(selectedApplication?.emergencyContactName)}</p>
                                    <p><span className="text-zinc-500">Emergency Phone:</span> {formatOptionalValue(selectedApplication?.emergencyContactPhone)}</p>
                                    <p><span className="text-zinc-500">Emergency Relation:</span> {formatOptionalValue(selectedApplication?.emergencyContactRelation)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                            <h4 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Documents</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 min-h-[200px]">
                                {selectedApplication?.profilePhoto && (
                                    <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
                                        <p className="text-xs font-medium mb-2 text-zinc-600 dark:text-zinc-400">Profile Photo</p>
                                        <img src={selectedApplication.profilePhoto} alt="Profile" className="h-56 w-full object-contain rounded-md" />
                                    </div>
                                )}
                                {selectedApplication?.nidFrontPhoto && (
                                    <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
                                        <p className="text-xs font-medium mb-2 text-zinc-600 dark:text-zinc-400">NID Front</p>
                                        <img src={selectedApplication.nidFrontPhoto} alt="NID Front" className="h-56 w-full object-contain rounded-md" />
                                    </div>
                                )}
                                {selectedApplication?.nidBackPhoto && (
                                    <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
                                        <p className="text-xs font-medium mb-2 text-zinc-600 dark:text-zinc-400">NID Back</p>
                                        <img src={selectedApplication.nidBackPhoto} alt="NID Back" className="h-56 w-full object-contain rounded-md" />
                                    </div>
                                )}
                                {selectedApplication?.licensePhoto && (
                                    <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
                                        <p className="text-xs font-medium mb-2 text-zinc-600 dark:text-zinc-400">License Photo</p>
                                        <img src={selectedApplication.licensePhoto} alt="License" className="h-56 w-full object-contain rounded-md" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Status History Modal */}
            <Dialog open={!!selectedHistoryApplication} onOpenChange={(open) => !open && setSelectedHistoryApplication(null)}>
                <DialogContent className="w-[95vw] md:max-w-2xl lg:max-w-3xl sm:w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Status History</DialogTitle>
                    </DialogHeader>

                    <div className="mt-2 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {selectedHistoryApplication?.user?.name || "Unknown User"}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {selectedHistoryApplication?.user?.email || "No email"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {getRejectionEntries(selectedHistoryApplication).length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                                        Rejected {getRejectionEntries(selectedHistoryApplication).length}×
                                    </span>
                                )}
                                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                    {getStatusTimeline(selectedHistoryApplication).length} event(s)
                                </span>
                            </div>
                        </div>

                        {getStatusTimeline(selectedHistoryApplication).length === 0 ? (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">No status history available.</p>
                        ) : (
                            <div className="relative">
                                <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                                <div className="space-y-3">
                                    {getStatusTimeline(selectedHistoryApplication).map((entry, index) => {
                                        const isLast = index === getStatusTimeline(selectedHistoryApplication).length - 1;
                                        const dotCls =
                                            entry.status === "APPROVED"
                                                ? "bg-emerald-500 border-emerald-300 dark:border-emerald-700"
                                                : entry.status === "REJECTED"
                                                ? "bg-rose-500 border-rose-300 dark:border-rose-700"
                                                : "bg-amber-400 border-amber-200 dark:border-amber-700";
                                        const cardCls =
                                            entry.status === "APPROVED"
                                                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20"
                                                : entry.status === "REJECTED"
                                                ? "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/20"
                                                : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20";
                                        const badgeCls =
                                            entry.status === "APPROVED"
                                                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                                                : entry.status === "REJECTED"
                                                ? "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
                                                : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300";

                                        return (
                                            <div key={`${entry.changedAt}-${entry.status}-${index}`} className="relative flex gap-3 pl-7">
                                                <div className={`absolute left-0 top-3 w-[22px] h-[22px] rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center z-10 ${dotCls} ${isLast ? "ring-2 ring-offset-1 ring-zinc-300 dark:ring-zinc-600" : ""}`}>
                                                    {entry.status === "APPROVED" && <CheckCircle size={11} className="text-white" />}
                                                    {entry.status === "REJECTED" && <XCircle size={11} className="text-white" />}
                                                    {entry.status === "PENDING" && <Clock size={11} className="text-white" />}
                                                </div>

                                                <div className={`flex-1 rounded-md border p-3 ${cardCls}`}>
                                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${badgeCls}`}>
                                                            {entry.status}
                                                        </span>
                                                        <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                                                            {entry.changedAt
                                                                ? new Date(entry.changedAt).toLocaleString()
                                                                : "Unknown date"}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                                                        By: <span className="font-medium">{getChangedByDisplay(entry.changedBy)}</span>
                                                    </p>
                                                    {entry.status === "REJECTED" && entry.reason && (
                                                        <p className="text-xs text-rose-700 dark:text-rose-300 mt-1.5 bg-rose-100/60 dark:bg-rose-900/30 rounded px-2 py-1">
                                                            Reason: {entry.reason.trim()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog
                open={rejectDialog.open}
                onOpenChange={(open) => {
                    if (!open && !isStatusUpdating) {
                        setRejectDialog({ open: false, appId: "" });
                        setRejectionReason("");
                    }
                }}
            >
                <DialogContent className="w-[95vw] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div>
                            <label className="text-sm font-medium">Rejection Reason</label>
                            <Input
                            className="mt-1"
                                placeholder="e.g. Blurry photo, mismatched IDs..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRejectDialog({ open: false, appId: "" });
                                setRejectionReason("");
                            }}
                            disabled={isStatusUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => submitStatusChange(rejectDialog.appId, "REJECTED", rejectionReason.trim())}
                            disabled={!rejectionReason.trim() || isStatusUpdating}
                        >
                            {isStatusUpdating ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Rejecting...
                                </>
                            ) : (
                                "Confirm Rejection"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DeleteConfirmation
                open={approveDialog.open}
                onOpenChange={(open) => {
                    if (!open && !isStatusUpdating) {
                        setApproveDialog({ open: false, appId: "" });
                    }
                }}
                onConfirm={handleApproveConfirm}
                title="Approve this application?"
                description="This will promote the applicant to Guide role and grant guide-level access."
                confirmText={isStatusUpdating ? "Approving..." : "Approve"}
                cancelText="Cancel"
                confirmClassName="bg-emerald-600 hover:bg-emerald-700"
                disabled={isStatusUpdating}
                contentClassName="sm:max-w-md"
            />
        </div>
    );
}
