import { useState } from "react";
import { useAllBookingsQuery, useUpdateBookingMutation } from "@/redux/features/booking/booking.api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, CalendarIcon, CreditCardIcon, Calendar } from "lucide-react";
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

export const ManageBookings = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("-createdAt");

    const { data: bookingsResponse, isLoading } = useAllBookingsQuery({
        page,
        limit: 10,
        searchTerm: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort: sortBy,
    });

    const [updateBooking] = useUpdateBookingMutation();

    const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
        const toastId = toast.loading("Updating booking status...");
        try {
            await updateBooking({ bookingId, bookingData: { status: newStatus } }).unwrap();
            toast.success(`Booking status updated successfully`, { id: toastId });
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data?.message || "Failed to update booking status", { id: toastId });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20 min-h-[60vh] items-center">
                <FullPageLoader />
            </div>
        );
    }

    const bookings = bookingsResponse?.data?.bookings || [];
    const meta = bookingsResponse?.data?.meta || { page: 1, totalPage: 1 };
    console.log("bookings==>", bookings);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold tracking-tight font-serif text-gray-900 dark:text-white">
                    Manage Bookings
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                        placeholder="Search by User, Email, or Transaction ID..."
                        className="pl-10 border-gray-200 dark:border-gray-800 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                    <SelectTrigger className="w-full md:w-[160px] border-gray-200 dark:border-gray-800">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="COMPLETE">Complete</SelectItem>
                        <SelectItem value="CANCEL">Cancelled</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setPage(1); }}>
                    <SelectTrigger className="w-full md:w-[180px] border-gray-200 dark:border-gray-800">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="-createdAt">Newest First</SelectItem>
                        <SelectItem value="createdAt">Oldest First</SelectItem>
                        <SelectItem value="-price">Highest Price</SelectItem>
                        <SelectItem value="price">Lowest Price</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                {bookings.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center">
                        <CalendarIcon size={48} className="mb-4 text-gray-300 dark:text-gray-700" />
                        <p className="text-lg font-medium">No Bookings Found</p>
                        <p className="text-sm">Try adjusting your filters or search term.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 pl-6">Booking Info</TableHead>
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Tour & Details</TableHead>
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Payment</TableHead>
                                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((booking: any) => (
                                    <TableRow key={booking._id} className="border-b dark:bg-slate-950 border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900 transition-colors">
                                        <TableCell className="pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">
                                                    {/* #{booking?.payment?.transactionId?.substring(booking?.payment?.transactionId?.length - 8).toUpperCase()} */}
                                                    #{booking?.payment?.transactionId}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(booking.createdAt)}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {booking.user?.name || "Unknown"}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {booking.user?.email || "No email"}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {booking.user?.phone || ""}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 line-clamp-1">
                                                    {booking.tour?.title || "Tour Unavailable"}
                                                </span>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 dark:text-gray-300">
                                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md font-medium">
                                                        {booking.guestCount} {booking.guestCount === 1 ? 'Guest' : 'Guests'}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                    ৳{booking.payment?.amount?.toLocaleString() || "0"}
                                                </span>
                                                <span className={`text-xs mt-1 font-medium flex items-center gap-1 ${booking.payment?.status === "PAID" ? "text-emerald-600 dark:text-emerald-400" :
                                                    booking.payment?.status === "FAILED" ? "text-red-500" :
                                                        booking.payment?.status === "CANCELLED" ? "text-gray-500" :
                                                            "text-amber-600 dark:text-amber-400"
                                                    }`}>
                                                    <CreditCardIcon size={12} />
                                                    {booking.payment?.status || "UNPAID"}
                                                </span>
                                                {booking.payment?.transactionId && (
                                                    <span className="text-[10px] text-gray-400 mt-0.5 font-mono" title={booking.payment.transactionId}>
                                                        Tx: {booking.payment.transactionId.substring(0, 10)}...
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Select
                                                value={booking.status}
                                                onValueChange={(val) => handleStatusUpdate(booking._id, val)}
                                            >
                                                <SelectTrigger className={`w-[130px] h-8 text-xs font-bold border-transparent focus:ring-0 focus:ring-offset-0 ${booking.status === 'COMPLETE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    booking.status === 'FAILED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        booking.status === 'CANCEL' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PENDING">PENDING</SelectItem>
                                                    <SelectItem value="COMPLETE">COMPLETE</SelectItem>
                                                    <SelectItem value="CANCEL">CANCEL</SelectItem>
                                                    <SelectItem value="FAILED">FAILED</SelectItem>
                                                </SelectContent>
                                            </Select>
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

export default ManageBookings;
