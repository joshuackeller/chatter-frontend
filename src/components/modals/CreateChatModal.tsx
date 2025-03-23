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
import CreateChat from "@/lib/data/chats/CreateChat";
import { Chat } from "@/lib/data/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";

const CreateChatModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>("");

  const { mutate: createChat, isPending } = useMutation({
    mutationFn: CreateChat,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createChat(
      { name },
      {
        onSuccess: (chat) => {
          setOpen(false);
          navigate(`/${chat.id}`);
          queryClient.setQueryData(["chats"], (prev: Chat[]) => [
            chat,
            ...prev,
          ]);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            Create a new chat. You can add people after you've creating it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              data-1p-ignore
              value={name}
              className="mt-1"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="mt-4">
              Create Chat
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatModal;
