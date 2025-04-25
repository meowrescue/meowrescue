import React, { useState } from "react";
import { FundraisingCampaign } from "@/types/finance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CampaignFormProps {
  campaign: FundraisingCampaign;
  onSave: (values: Omit<FundraisingCampaign, "id" | "amountRaised" | "percentComplete">) => void;
  onCancel: () => void;
}

const COMMON_CAMPAIGN_TYPES = [
  "General Fund",
  "Medical",
  "Food",
  "Supplies",
  "Transport",
  "Operations",
  "Spay/Neuter",
  "Vaccinations",
  "Emergency",
  "Shelter Rent",
  "Utilities",
  "Kitten Care",
  "Special Needs",
  "Trap-Neuter-Return",
  "Adoption Events",
  "Foster Supplies",
  "Senior Cats",
  "Dental",
  "Behavioral Rehab",
  "Microchipping",
  "Rescue Missions",
  "Surgery Fund",
  "Chronic Illness",
  "Maternity Care",
  "Quarantine",
  "FIV/FeLV Support"
];

const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: campaign.name || "",
    description: campaign.description || "",
    targetAmount: campaign.targetAmount || 0,
    startDate: campaign.startDate || "",
    endDate: campaign.endDate || "",
    campaignType: campaign.campaignType || "General Fund"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSave({
      name: form.name,
      description: form.description,
      targetAmount: typeof form.targetAmount === "string" ? parseFloat(form.targetAmount as any) : form.targetAmount,
      startDate: form.startDate,
      endDate: form.endDate,
      campaignType: form.campaignType
    });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          name="description"
          required
          rows={3}
          className="form-input"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="targetAmount">Target Amount</Label>
        <Input
          name="targetAmount"
          type="number"
          step="1"
          min="0"
          value={form.targetAmount}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="campaignType">Campaign Type</Label>
        <select 
          name="campaignType"
          className="form-input w-full rounded border-gray-300"
          value={form.campaignType}
          onChange={handleChange}
        >
          {COMMON_CAMPAIGN_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            name="startDate"
            type="date"
            value={form.startDate?.slice(0, 10) || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            name="endDate"
            type="date"
            value={form.endDate?.slice(0, 10) || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default CampaignForm;
