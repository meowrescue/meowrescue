import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  experience: z.string().optional(),
  availability: z.string().min(10, {
    message: "Please describe your availability.",
  }),
  motivation: z.string().min(20, {
    message: "Please describe your motivation for volunteering.",
  }),
});

const VolunteerForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      experience: "",
      availability: "",
      motivation: "",
    },
    mode: "onChange",
  });

  const { reset } = form;

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error("You must be logged in to submit an application");
      }

      // Type assertion for RPC function call
      const { data: applicationId, error } = await supabase
        .rpc('create_application', {
          p_applicant_id: user.id,
          p_application_type: 'volunteer',
          p_status: 'pending',
          p_form_data: { ...data }
        }) as unknown as {data: string | null, error: Error | null};

      if (error) throw error;

      setSuccess(true);
      setOpen(true);
      reset();
    } catch (error: any) {
      console.error("Error submitting application:", error);
      setErrorMessage(error.message || "An error occurred while submitting your application");
      setError(true);
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <SEO title="Volunteer Application | Meow Rescue" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{success ? "Application Submitted" : "Error"}</DialogTitle>
            <DialogDescription>
              {success ? "Thank you for your interest in volunteering! We will review your application and contact you soon." : errorMessage}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => { setOpen(false); success && navigate('/') }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Volunteer Application</h1>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              {...form.register("firstName")}
              placeholder="Enter your first name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {form.formState.errors.firstName && (
              <p className="text-red-500 text-xs italic">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              {...form.register("lastName")}
              placeholder="Enter your last name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {form.formState.errors.lastName && (
              <p className="text-red-500 text-xs italic">{form.formState.errors.lastName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="Enter your email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs italic">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              placeholder="Enter your phone number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {form.formState.errors.phone && (
              <p className="text-red-500 text-xs italic">{form.formState.errors.phone.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </Label>
            <Input
              id="address"
              type="text"
              {...form.register("address")}
              placeholder="Enter your address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {form.formState.errors.address && (
              <p className="text-red-500 text-xs italic">{form.formState.errors.address.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="experience" className="block text-gray-700 text-sm font-bold mb-2">
              Previous Experience (Optional)
            </Label>
            <Textarea
              id="experience"
              {...form.register("experience")}
              placeholder="Describe any previous volunteer experience"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <Label htmlFor="availability" className="block text-gray-700 text-sm font-bold mb-2">
              Availability
            </Label>
            <Textarea
              id="availability"
              {...form.register("availability")}
              placeholder="Describe your availability for volunteering"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {form.formState.errors.availability && (
              <p className="text-red-500 text-xs italic">{form.formState.errors.availability.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="motivation" className="block text-gray-700 text-sm font-bold mb-2">
              Motivation
            </Label>
            <Textarea
              id="motivation"
              {...form.register("motivation")}
              placeholder="Why do you want to volunteer at Meow Rescue?"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {form.formState.errors.motivation && (
              <p className="text-red-500 text-xs italic">{form.formState.errors.motivation.message}</p>
            )}
          </div>
          <div>
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VolunteerForm;
