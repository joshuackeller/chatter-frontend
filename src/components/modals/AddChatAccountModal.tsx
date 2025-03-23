import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddChatAccount from "@/lib/data/chats/AddChatAccount";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

const AddChatAccountModal = ({
  chatId,
  open,
  setOpen,
}: {
  chatId: string;
  open: boolean;
  setOpen: (val: boolean) => void;
}) => {
  const [email, setEmail] = useState<string>("");

  const { mutate: addAccount, isPending } = useMutation({
    mutationFn: AddChatAccount,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addAccount(
      {
        chatId,
        username: email,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription>Add a new account to the chat</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              data-1p-ignore
              value={email}
              className="mt-1"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="mt-4">
              Add Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChatAccountModal;
