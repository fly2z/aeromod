import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CompleteSetup } from "@wailsjs/go/main/App";

const windowsPathFormat = z.string().refine(
  (value) => {
    // Check if it's a Windows path without a trailing slash
    return /^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/.test(
      value
    );
  },
  {
    message: "Invalid path format.",
  }
);

const formSchema = z.object({
  communityPath: windowsPathFormat,
  modFolderPath: windowsPathFormat,
});

export default function SetupDialog() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      communityPath: "",
      modFolderPath: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    CompleteSetup(values.communityPath, values.modFolderPath)
      .catch(() => toast.error("Failed to complete setup."))
      .then(() => navigate(0));
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set AeroMod up</DialogTitle>
          <DialogDescription>
            Configure your mod and community folder paths.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="communityPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MSFS Community Folder Path</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is where MSFS loads the mods from.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modFolderPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mods Folder Path</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is where the mod files are stored.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
