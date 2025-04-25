
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CatFoodDetailsProps {
  expenseData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const CatFoodDetails: React.FC<CatFoodDetailsProps> = ({ expenseData, handleChange }) => (
  <div className="border rounded-md p-4 space-y-4 bg-gray-50">
    <h3 className="font-medium text-gray-700">Cat Food Details</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="food_brand">Brand</Label>
        <Input
          id="food_brand"
          name="food_brand"
          placeholder="Food brand"
          value={expenseData.food_brand}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="food_type">Type</Label>
        <Input
          id="food_type"
          name="food_type"
          placeholder="Wet/Dry/etc."
          value={expenseData.food_type}
          onChange={handleChange}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          placeholder="Number of items"
          value={expenseData.quantity}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="units">Units</Label>
        <Input
          id="units"
          name="units"
          placeholder="cans/bags/boxes"
          value={expenseData.units}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cost_per_unit">Cost Per Unit</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input
            id="cost_per_unit"
            name="cost_per_unit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={expenseData.cost_per_unit}
            onChange={handleChange}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  </div>
);

export default CatFoodDetails;
