// Lightweight wrapper around Sonner toast system so we can import via alias
import { Toaster as SonnerToaster } from "sonner";
export const Toaster = () => <SonnerToaster richColors position="top-center" />;
export default Toaster;
