
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Truck } from "lucide-react";

interface OrderShippingDetailsProps {
  expenseData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const OrderShippingDetails: React.FC<OrderShippingDetailsProps> = ({ expenseData, handleChange }) => (
  <div className="border rounded-md p-4 space-y-4 bg-gray-50">
    <h3 className="font-medium text-gray-700 flex items-center gap-2">
      <Truck className="h-4 w-4" /> Order & Shipping Details
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="order_number">Order Number</Label>
        <Input
          id="order_number"
          name="order_number"
          placeholder="Order reference number"
          value={expenseData.order_number}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tracking_number">Tracking Number</Label>
        <Input
          id="tracking_number"
          name="tracking_number"
          placeholder="Shipping tracking number"
          value={expenseData.tracking_number}
          onChange={handleChange}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="shipping_carrier">Shipping Carrier</Label>
        <Input
          id="shipping_carrier"
          name="shipping_carrier"
          placeholder="USPS, UPS, FedEx, etc."
          value={expenseData.shipping_carrier}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expected_delivery_date">Expected Delivery</Label>
        <Input
          id="expected_delivery_date"
          name="expected_delivery_date"
          type="date"
          value={expenseData.expected_delivery_date}
          onChange={handleChange}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="notes">Additional Notes</Label>
      <textarea
        id="notes"
        name="notes"
        value={expenseData.notes}
        onChange={handleChange}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Any additional information about this order"
      />
    </div>
  </div>
);

export default OrderShippingDetails;
